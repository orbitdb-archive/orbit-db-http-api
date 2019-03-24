const Express   = require('express');

const asyncMiddleware = fn =>
(req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch((err) => next(err));
};

class OrbitdbAPI extends Express {
    constructor (dbm) {
        super();
        this.debug = false

        this.use(Express.urlencoded({extended: true }));
        this.use(Express.json());

        var error_handler = (err, req, res, next) => {
            if (err) {
                console.error(err)
                if (res.headersSent) {
                    return next(err)
                }
                if (this.debug) return res.status(err.statusCode || 500).json([err.description, err]);
                return res.status(err.statusCode || 500).json('ERROR')
            }
            next()
        }

        this.get('/dbs', (req, res, next) => {
            try {
                return res.json(dbm.db_list());
            } catch(err) {
                next(err)
            }
        });

        this.post('/db', asyncMiddleware( async (req, res, next) => {
            let db
            db = await dbm.get(req.body.dbname, req.body)
            return res.json(dbm.db_info(db.dbname));
        }));

        this.post('/db/:dbname', asyncMiddleware( async (req, res, next) => {
            let db
            db = await dbm.get(req.params.dbname, req.body)
            return res.json(dbm.db_info(db.dbname));
        }));

        this.get('/db/:dbname', (req, res, next) => {
            try {
                return res.json(dbm.db_info(req.params.dbname));
            } catch(err) {
                next(err)
            }
        });

        this.delete('/db/:dbname/:item', asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            if (db.del) {
                hash = await db.del(req.params.item)
            } else if (db.remove) {
                hash = await db.remove(req.params.item)
            } else {
                throw new Error(`DB type ${db.type} does not support removing data`)
            }
            return res.json(hash)
        }));

        var db_put = asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.put(req.body)
            return res.json(hash)
        });

        this.post('/db/:dbname/put', db_put);
        this.put('/db/:dbname/put', db_put);

        var db_add = asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.add(req.body)
            return res.json(hash)
        });

        this.post('/db/:dbname/add', db_add);
        this.put('/db/:dbname/add', db_add);

        var db_inc = asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.inc(parseInt(req.body.val))
            return res.json(hash)
        });

        this.post('/db/:dbname/inc', db_inc);
        this.put('/db/:dbname/inc', db_inc);

        var db_inc_val =  asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.inc(parseInt(req.params.val))
            return res.json(hash)
        });

        this.post('/db/:dbname/inc/:val', db_inc_val);
        this.put('/db/:dbname/inc/:val', db_inc_val);

        var comparisons = {
            'ne': (a, b) => a != b,
            'eq': (a, b) => a == b,
            'gt': (a, b) => a > b,
            'lt': (a, b) => a < b,
            'gte': (a, b) => a >= b,
            'lte': (a, b) => a <= b,
            'mod': (a, b, c) => a % b == c,
            'range': (a, b, c) => Math.max(b,c) >= a && a >= Math.min(b,c),
            'all': () => true
        };

        this.get('/db/:dbname/query',  asyncMiddleware( async (req, res, next) => {
            let db, qparams, comparison, query, result;
            db = await dbm.get(req.params.dbname);
            qparams = req.body;
            comparison = comparisons[qparams.comp || 'all']
            query = (doc) => comparison(doc[qparams.propname || '_id'], ...qparams.values)
            result = await db.query(query)
            return res.json(result)
        }));

        this.get('/db/:dbname/iterator',  asyncMiddleware( async (req, res, next) => {
            let result, raw;
            raw = await rawiterator(req,res,next)
            result = raw.map((e) => e.payload.value)
            return res.json(result)
        }));

        var rawiterator = async (req, res, next) => {
            let db;
            db = await dbm.get(req.params.dbname);
            return db.iterator(req.body).collect()
        };

        this.get('/db/:dbname/rawiterator',  asyncMiddleware( async (req, res, next) => {
            return res.json(await rawiterator(req,res,next))}));

        var getraw = async (req, res, next) => {
            let db
            db = await dbm.get(req.params.dbname)
            return await db.get(req.params.item)
        }

        this.get('/db/:dbname/raw/:item',  asyncMiddleware( async (req, res, next) => {
            let contents
            contents = await getraw(req, res, next)
            return res.json(contents)
        }));

        this.get('/db/:dbname/value',  asyncMiddleware( async (req, res, next) => {
            let db, val
            db = await dbm.get(req.params.dbname)
            return res.json(db.value)
        }));

        this.get('/db/:dbname/:item',  asyncMiddleware( async (req, res, next) => {
            let result, contents
            contents = await getraw(req,res, next)
            if (contents.map && contents.payload) {
                result = contents.map((e) => e.payload.value)
            } else if (contents.payload) {
                result = contents.payload.value
            } else {
                result = contents
            }
            return res.json(result)
        }));

        this.use(error_handler);
    }
}

module.exports = OrbitdbAPI
