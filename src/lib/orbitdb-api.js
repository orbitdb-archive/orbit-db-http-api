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

        this.get('/db/:dbname/:key',  asyncMiddleware( async (req, res, next) => {
            let db
            db = await dbm.get(req.params.dbname, req.body)
            contents = await db.get(req.params.key)
            return res.json(contents)
        }));

        this.post('/db/:dbname', asyncMiddleware( async (req, res, next) => {
            let db
            db = await dbm.get(req.params.dbname, req.body)
            return res.json(dbm.db_info(db.dbname));
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
