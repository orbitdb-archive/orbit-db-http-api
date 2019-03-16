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
node src/cli.js api --ipfs-host localhost --orbitdb-dir /path/to/orbitdb
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
{"docstore":{"address":{"root":"zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq","path":"docstore"},"dbname":"docstore","id":"/orbitdb/zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq/docstore","options":{"create":"true","indexBy":"_id","localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"docstore"},"feed":{"address":{"root":"zdpuAo6DwafMiyuzhfEojXJThFPdv4Eu9hLfaWrKD6GSVzyjj","path":"feed"},"dbname":"feed","id":"/orbitdb/zdpuAo6DwafMiyuzhfEojXJThFPdv4Eu9hLfaWrKD6GSVzyjj/feed","options":{"create":"true","localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"feed"}}
```

### GET /db/:dbname

Gets the details of a database with name :dbname.

Returns information about the database as a JSON object.

```shell
curl http://localhost:3000/db/docstore
```

```json
{"address":{"root":"zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq","path":"docstore"},"dbname":"docstore","id":"/orbitdb/zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq/docstore","options":{"create":"true","indexBy":"_id","localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"docstore"}
```

### GET /db/:dbname/:item

Gets a record identified by :item from the database :dbname.

Returns a list of found items as a JSON array.

For the data type docstore, :item must be a value identified by the index field (set using indexBy).

```shell
curl -X GET http://localhost:3000/db/docstore/1
```

```json
[{"_id":1, "value": "test"}]
```

### POST /db/:dbname

Creates a new database and returns information about the newly created database.

Returns information about the database as a JSON object.

The OrbitDB options ```create=true``` and ```type=eventlog|feed|docstore|keyvalue|counter```
must be sent with the POST otherwise an error is thrown.

```shell
curl http://localhost:3000/db/docstore -d "create=true" -d "type=docstore"
```

```json
{"address":{"root":"zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq","path":"docstore"},"dbname":"docstore","id":"/orbitdb/zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq/docstore","options":{"create":"true","indexBy":"_id","localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"docstore"}
```

Additional OrbitDB-specific flags can also be passed. For example, if the index
field must be changed then the indexBy flag can be specified as an additional
POST param (this would apply to type docstore only):

```shell
curl http://localhost:3000/db/docstore -d "create=true" -d "type=docstore" -d "indexBy=name"
```

## POST|PUT /db/:dbname/add

Adds a new entry to the eventlog or feed database :dbname.

Returns the multihash of the new record entry.

Can be only used on eventlog|feed

```shell
curl -X POST http://localhost:3000/db/feed/add -d 'feed-item-1'
```

```json
zdpuArB1ZQUQGGpZgJrhy6xyxwxMCE898kDrQW2x6KbnRNbAn
```

### POST|PUT /db/:dbname/put

Puts a record to the database :dbname.

Returns a multihash of the record entry.

```shell
curl -X POST http://localhost:3000/db/docstore/put -H "Content-Type: application/json" -d '{"_id":1, "value": "test"}'
```

```json
zdpuAkkFaimxyRE2bsiLRSiybkku3oDi4vFHqPZh29BABZtZU
```

### DELETE /db/:dbname/:item

Deletes the item specified by :item from the database :dbname.

Returns the multihash of the item entry deleted or an error if no item is found.

```shell
curl -X DELETE http://localhost:3000/db/docstore/1
```

```json
zdpuB39Yv1LV6CMYuNUgRi125utDpUoiP7PDsumjn1T4ASkzN
```
