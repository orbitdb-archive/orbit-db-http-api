const Ipfs      = require('ipfs');
const OrbitDB   = require('orbit-db');
const DBManager = require('../lib/db-manager.js')
const OrbitApi  = require('../lib/orbitdb-api.js')


function api_factory(ipfs_opts, orbitdb_dir, orbitdb_opts) {
    let ipfs
    let orbitdb
    let dbm
    let orbitdb_api

    ipfs        = Ipfs(ipfs_opts)
    orbitdb     = OrbitDB(ipfs, orbitdb_dir, orbitdb_opts)
    dbm         = DBManager(orbitdb)
    orbitdb_api = OrbitApi(dbm)

    return orbitdb_api
}

module.exports = api_factory
