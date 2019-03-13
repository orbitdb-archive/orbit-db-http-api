const IpfsApi   = require('ipfs-api');
const OrbitDB   = require('orbit-db');
const DBManager = require('../lib/db-manager.js')
const OrbitApi  = require('../lib/orbitdb-api.js')


function api_factory(ipfs_host, ipfs_port, orbitdb_dir, orbitdb_opts) {
    let ipfs
    let orbitdb
    let dbm
    let orbitdb_api

    ipfs        = IpfsApi(ipfs_host, ipfs_port)
    orbitdb     = OrbitDB(ipfs, orbitdb_dir, orbitdb_opts)
    dbm         = DBManager(orbitdb)
    orbitdb_api = OrbitApi(dbm)

    return orbitdb_api
}

module.exports = api_factory
