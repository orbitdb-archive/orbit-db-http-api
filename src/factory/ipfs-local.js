const Ipfs      = require('ipfs');
const OrbitDB   = require('orbit-db');
const DBManager = require('../lib/db-manager.js')
const OrbitApi  = require('../lib/orbitdb-api.js')


async function api_factory(ipfs_opts, orbitdb_dir, orbitdb_opts) {
    let ipfs, orbitdb, dbm, orbitdb_api, ipfs_defaults

    ipfs_defaults = {
        EXPERIMENTAL: {
            pubsub: true
        },
        start: true,
        config: {
                Addresses: {
                Swarm: [
                '/dnsaddr/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
                '/dnsaddr/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
                ]
            }
        }
    }

    ipfs_opts   = Object.assign(ipfs_defaults, ipfs_opts)
    ipfs        = await new Promise((resolve, reject) => {
        var node = new Ipfs(ipfs_opts)
        node.on("ready", () => {
          resolve(node)
        })
      }).catch((ex) => {throw ex})
    if (orbitdb_dir) orbitdb_opts = object.assign({'directory': orbitdb_dir}, orbitdb_opts || {})
    orbitdb     = await OrbitDB.createInstance(ipfs, orbitdb_opts)
    dbm         = new DBManager(orbitdb)
    orbitdb_api = new OrbitApi(dbm)

    return orbitdb_api
}

module.exports = api_factory
