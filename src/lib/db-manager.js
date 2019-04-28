class DBManager {
    constructor(orbitdb){
        let _dbs = {};

        let find_db = (dbn)  => {
            if (dbn in _dbs) return _dbs[dbn]
            _dbs.forEach(db => {
                if (dbn = db.id) {
                    return db
                } else if (dbn = [db.address.root, db.address.path].join('/')) {
                    return db
                }
            });
        };

        this.get = async (dbn, params) => {
            let db = find_db(dbn);
            if (db) {
                return db;
            } else {
                console.log(`Opening db ${dbn}`);
                db = await orbitdb.open(dbn, params);
                await db.load();
                console.log(`Loaded db ${db.dbname}`);
                _dbs[db.dbname] = db;
                return db;
            }
        };

        this.db_list_remove = (dbn) => {
            db = find_db(dbn)
            if (db) {
                await db.disconnect()
                delete _dbs[db.dbname];
            }
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
            let db = find_db(dbn);
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
