const Ipfs      = require('ipfs');
const OrbitDB   = require('orbit-db');
const DBManager = require('../lib/db-manager.js')
const OrbitApi  = require('../lib/orbitdb-api.js')


async function api_factory(ipfs_opts, orbitdb_dir, orbitdb_opts, server_opts) {
    let ipfs, orbitdb, dbm, orbitdb_api, ipfs_defaults

    ipfs_defaults = {
        EXPERIMENTAL: {
            pubsub: true
        },
        start: true,
        config: {
                Addresses: {
                Swarm: [
                  //                  '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
                ]
            }
        }
    }
    if (orbitdb_dir) orbitdb_opts = Object.assign({'directory': orbitdb_dir}, orbitdb_opts)
    ipfs_opts   = Object.assign(ipfs_defaults, ipfs_opts)
    ipfs        = await Ipfs.create(ipfs_opts)
    orbitdb     = await OrbitDB.createInstance(ipfs, orbitdb_opts)
    dbm         = new DBManager(orbitdb)
    orbitdb_api = new OrbitApi(dbm, server_opts)

    return orbitdb_api
}

module.exports = api_factory
