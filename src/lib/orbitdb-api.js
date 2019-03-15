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

        this.get('/db/:dbname', (req, res, next) => {
            try {
                return res.json(dbm.db_info(req.params.dbname));
            } catch(err) {
                next(err)
            }
        });

        this.get('/db/:dbname/:item',  asyncMiddleware( async (req, res, next) => {
            let db, contents
            db = await dbm.get(req.params.dbname)
            contents = await db.get(req.params.item)
            return res.json(contents)
        }));

        this.all('/db/:dbname/put',  asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.put(req.body)
            return res.json(hash)
        }));

        this.all('/db/:dbname/add',  asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.add(req.body)
            return res.json(hash)
        }));

        this.all('/db/:dbname/inc',  asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.inc(req.body.val)
            return res.json(hash)
        }));

        this.all('/db/:dbname/inc/:val',  asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.inc(req.params.val)
            return res.json(hash)
        }));

        this.post('/db/:dbname', asyncMiddleware( async (req, res, next) => {
            let db
            db = await dbm.get(req.params.dbname, req.body)
            return res.json(dbm.db_info(db.dbname));
        }));

        this.post('/db', asyncMiddleware( async (req, res, next) => {
            let db
            db = await dbm.get(req.body.dbname, req.body)
            return res.json(dbm.db_info(db.dbname));
        }));

        this.delete('/db/:dbname/:item', asyncMiddleware( async (req, res, next) => {
            let db, hash
            db = await dbm.get(req.params.dbname)
            hash = await db.del(req.params.item)
            return res.json(hash)
        }));

    var comparisons = {
        '==': (a, b) => a == b ,
        '>': (a, b) => a > b ,
        '<': (a, b) => a < b ,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
        '%': (a, b, c) => a % b == c
    };

    this.all('/db/:dbname/query',  asyncMiddleware( async (req, res, next) => {
            let db, qparams, query, result;
            db = await dbm.get(req.params.dbname);
            qparams = req.body;
            comparator = comparisons[qparams.comparator]
            query = (doc) => comparator(doc[qparams.propname], ...qparams.values)
            result = await db.query(query)
            return res.json(result)
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
