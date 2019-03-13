const OrbitDB   = require('orbit-db');
const Express   = require('express');
const DBManager = require('./db-manager.js')

const asyncMiddleware = fn =>
(req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
};

class OrbitdbAPI extends Express {
    constructor (ipfs) {
        _api_port = process.env.API_PORT;
        _orbitdb_dir = process.env.ORBITDB_DIR
        _orbitdb = new OrbitDB(ipfs, _orbitdb_dir)
        _dbm = new DBManager(_orbitdb)

        super()

        this.use(Express.urlencoded({extended: true }));
        this.use(Express.json());

        this.get('/dbs', (req, res, next) => {
            try {
                return res.json(_dbm.db_list());
            } catch(err) {
                next(err)
            }
        });

        this.get('/db/:dbname', (req, res, next) => {
            try {
                return res.json(_dbm.db_info(req.params.dbname));
            } catch(err) {
                next(err)
            }
        });

        this.post('/db/:dbname', asyncMiddleware( async (req, res, next) => {
            db = await _dbm.get(req.params.dbname, req.body)
            return res.json(_dbm.db_info(db.dbname));
        }));

        this.use(function (err, req, res, next) {
            console.error(err)
            if (res.headersSent) {
                return next(err)
            }
            return res.status(500).json('ERROR')
        });

        this.init = async () => {
            this.listen(api_port, () => {
                console.log(`Server running on port ${_api_port}`);
            });
        }
    }
}

module.exports = OrbitdbAPI
