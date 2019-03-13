const Ipfs      = require('ipfs');
const OrbitApi  = require('lib/orbitdb-api.js')


function api_factory() {
    var ipfs_dir = process.env.IPFS_DIR

    try {
        _ipfs = Ipfs({repo: ipfs_dir})
        _orbitdb_api = OrbitApi()
       Promise.resolve(_orbitdb_api.init(_ipfs)).catch((err) => {throw err})
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
    return _orbitdb_api
}

module.exports = api_factory
