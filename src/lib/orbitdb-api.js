const Express   = require('express');

const asyncMiddleware = fn =>
(req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
};

class OrbitdbAPI extends Express {
    constructor (dbm) {
        super();

        this.use(Express.urlencoded({extended: true }));
        this.use(Express.json());

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

        this.get('/db/:dbname', (req, res, next) => {
            try {
                return res.json(dbm.db_info(req.params.dbname));
            } catch(err) {
                next(err)
            }
        });

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
            hash = await db.inc(req.body.val)
            return res.json(hash)
        });

        this.post('/db/:dbname/inc', db_inc);
        this.put('/db/:dbname/inc', db_inc);

        var db_inc_val =  asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.inc(req.params.val)
            return res.json(hash)
        });

        this.post('/db/:dbname/inc/:val', db_inc_val);
        this.put('/db/:dbname/inc/:val', db_inc_val);

        this.post('/db/:dbname', asyncMiddleware( async (req, res, next) => {
            let db
            db = await dbm.get(req.params.dbname, req.body)
            return res.json(dbm.db_info(db.dbname));
        }));

        var comparisons = {
            '==': (a, b) => a == b ,
            '>': (a, b) => a > b ,
            '<': (a, b) => a < b ,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '%': (a, b, c) => a % b == c
        };

        this.get('/db/:dbname/query',  asyncMiddleware( async (req, res, next) => {
                let db, qparams, query, result;
                db = await dbm.get(req.params.dbname);
                qparams = req.body;
                comparator = comparisons[qparams.comparator]
                query = (doc) => comparator(doc[qparams.propname], ...qparams.values)
                result = await db.query(query)
                return res.json(result)
            }));

        this.delete('/db/:dbname/:item', asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.del(req.params.item)
            return res.json(hash)
        }));

        this.get('/db/:dbname/:item',  asyncMiddleware( async (req, res, next) => {
            let db, contents
            db = await dbm.get(req.params.dbname)
            contents = await db.get(req.params.item)
            return res.json(contents)
        }));

        this.use(function (err, req, res, next) {
            console.error(err)
            if (res.headersSent) {
                return next(err)
            }
            return res.status(500).json('ERROR')
        });
    }
}

module.exports = OrbitdbAPI
