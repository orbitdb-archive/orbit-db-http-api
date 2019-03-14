const IpfsApi   = require('ipfs-http-client');
const OrbitDB   = require('orbit-db');
const DBManager = require('../lib/db-manager.js')
const OrbitApi  = require('../lib/orbitdb-api.js')


function api_factory(ipfs_host, ipfs_port, orbitdb_dir, orbitdb_opts) {
    let ipfs
    let orbitdb
    let dbm
    let orbitdb_api

    ipfs        = new IpfsApi(ipfs_host, ipfs_port)
    orbitdb     = OrbitDB.createInstance(ipfs, orbitdb_dir, orbitdb_opts)
    dbm         = new DBManager(orbitdb)
    orbitdb_api = new OrbitApi(dbm)

    return orbitdb_api
}

module.exports = api_factory
