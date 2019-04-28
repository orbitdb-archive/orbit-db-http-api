class DBManager {
    constructor(orbitdb){
        let _dbs = {};

        this.get = async (dbname, params) => {
            if (dbname in _dbs) {
                return _dbs[dbname];
            } else {
                let db;
                console.log(`Opening db ${dbname}`);
                db = await orbitdb.open(dbname, params);
                await db.load();
                console.log(`Loaded db ${db.dbname}`);
                _dbs[db.dbname] = db;
                return db;
            }
        };

        this.db_list_remove = (dbname) => {
            delete _dbs[dbname];
        }

        this.db_list = () => {
            let db_info_list = {};
            for (var dbn in _dbs) {
                if (_dbs.hasOwnProperty(dbn)) {
                    db_info_list[dbn] = this.db_info(dbn);
                }
            }
            return JSON.stringify(db_info_list);
        };

        this.db_info = (dbn) => {
            var db = _dbs[dbn];
            if (!db) {
                _dbs.forEach(d => {
                    if (dbn = d.id) {
                        db = d
                    } else if (dbn = [d.address.root, d.address.path].join('/')) {
                        db = d
                    }
                });
            }
            if (!db) return {};
            return {
                address: db.address,
                dbname: db.dbname,
                id: db.id,
                options: {
                    create: db.options.create,
                    indexBy: db.options.indexBy,
                    localOnly: db.options.localOnly,
                    maxHistory: db.options.maxHistory,
                    overwrite: db.options.overwrite,
                    path: db.options.path,
                    replicate: db.options.replicate,
                },
                type: db.type,
                uid: db.uid
            };
        };
    }
}

module.exports = DBManager;
