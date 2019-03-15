# OrbitDB HTTP Client

> An HTTP Client for the OrbitDB distributed peer-to-peer database.

## Install

To install the OrbitDB HTTP Client:

```shell
git clone https://github.com/phillmac/orbit-db-api.git
cd orbit-db-api
npm install
```

## Setup

The OrbitDB HTTP Client can be run in two modes; local or api.

In local mode, OrbitDB HTTP Client will launch its own IPFS node to replicate
the OrbitDB peer:

```shell
node src/cli.js local --orbitdb-dir /path/to/orbitdb
```

where --orbitdb-dir is the path to your OrbitDB peer.

In api mode, OrbitDB HTTP Client will connect to an existing IPFS node to
replicate the OrbitDB peer:

```shell
node src/cli.js api --ipfs-host ipfs_host --orbitdb-dir /path/to/orbitdb
```

where --ipfs-host is an external IPFS node and --orbitdb-dir is the path to
your OrbitDB peer.

## API

### GET /dbs

Lists all databases on the current peer.

```shell
curl http://localhost:3000/dbs
```

```json
{"test":{"address":{"root":"zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6","path":"test"},"dbname":"test","id":"/orbitdb/zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6/test","options":{"create":true,"localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"feed"}}
```

### GET /db/:dbname

Gets the details of a database with name :dbname.

```shell
curl http://localhost:3000/db/test
```

```json
{"address":{"root":"zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6","path":"test"},"dbname":"test","id":"/orbitdb/zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6/test","options":{"create":true,"localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"feed"}
```
### POST /db/:dbname
Opens an existing database or creates a new database with name :dbname

To open a pre-existing database :dbname should be a url-encoded orbit-db address.

```shell
curl  -X POST http://localhost:3000/db/%2Forbitdb%2FzdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6%2Ftest
```


```json
{"address":{"root":"zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6","path":"test"},"dbname":"test","id":"/orbitdb/zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6/test","options":{"create":false,"localOnly":false,"maxHistory":-1,"replicate":true},"type":"feed"}
```

To create a fresh database, :dbname should be the intended name of the new database.
The body of the request should contain the parameters for the new database.
See [orbitdb/orbit-db/API.md](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbcreatename-type-options) for full details 

```shell
curl http://localhost:3000/db/test --data create=true --data type=feed
```

``json
{"address":{"root":"zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6","path":"test"},"dbname":"test","id":"/orbitdb/zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6/test","options":{"create":true,"localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"feed"}
```

### GET /db/:dbname/get/:item

### POST /db/:dbname/add

Adds a database called :dbname to the peer.

Returns the new databse's hash if successful.

```shell
curl -X POST http://localhost:3000/db/:dbname/add
```

```json
zdpuAxyAVXKV5Wn6KGZysfJMkxhDKYU9aziviWqFS4AJWaMi6
```

### POST /db/:dbname

### POST /db/:dbname/put

### DELETE /db/:dbname/:item
