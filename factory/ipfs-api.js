const IpfsApi     = require('ipfs-api');
const OrbitApi    = require('lib/orbitdb-api.js')


function api_factory() {
    var ipfs_host = process.env.IPFS_HOST
    var ipfs_port = process.env.IPFS_PORT

    try {
        _ipfs = IpfsApi(ipfs_host, ipfs_port)
        _orbitdb_api = OrbitApi()
       Promise.resolve(_orbitdb_api.init(_ipfs)).catch((err) => {throw err})
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
    return _orbitdb_api
}

module.exports = api_factory
