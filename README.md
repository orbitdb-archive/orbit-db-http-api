# OrbitDB HTTP API Server

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby)

> A HTTP API Server for the OrbitDB distributed peer-to-peer database.

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

### GET /db/:dbname/value

Gets the current value from counter database :dbname.

Returns the current counter value.

Can only be used on counter.

```shell
curl -X GET http://localhost:3000/db/counter/value
```

```json
1
```

### GET /db/:dbname/query

Queries the database :dbname.

Returns a list of found items as a JSON array.

```shell
curl http://localhost:3000/db/docstore/query -X GET -H "Content-Type: application/json" --data '{"values":[]}'
```

```json
[{"project":"OrbitDB","site":"https://github.com/orbitdb/orbit-db","likes":200},{"project":"IPFS","site":"https://ipfs.io","likes":400}]
```

To query a subset of data, a condition can be specified. For example, to
retrieve only those entries which have a total number of likes above 300:

```shell
curl http://localhost:3000/db/docstore/query -X GET -H "Content-Type: application/json" --data '{"propname":"likes","comp":">","values":[300]}'
```

```json
[{"project":"IPFS","site":"https://ipfs.io","likes":400}]
```

Available operator short-codes are:

```eq```    propname equals value. Equivalent to "=="

```ne```    propname is not equals to value. Equivalent to "!="

```gt```    propname is greater than value. Equivalent to ">"

```lt```    propname is less than value. Equivalent to "<"

```gte```   propname is greater than or equal to value. Equivalent to ">="

```lte```   propname is less than or equal to value. Equivalent to "<="

```mod```   Perform a modulus calculation on propname using value. Equivalent to "%"

```range``` Perform a range query, comparing propname to min and max.

```all```   Fetch all records for field propname. Equivalent to "*"

#### Modulus Query

When using a modulus query, you must supply the divisor and the remainder. For example, to obtain all likes which are multiples of 100, you would specify a divisor 100 and a remainder 0:

```shell
curl -X GET http://localhost:3000/db/docstore/query -H "Content-Type:application/json" --data '{"propname":"likes", "comp":"mod", "values":[100,0]}'
```

```json
[{"site":"https://ipfs.io","likes":400,"project":"IPFS"},{"site":"https://github.com/orbitdb/orbit-db","likes":200,"project":"OrbitDB"}]
```

#### Range Query

When specifying a range query, you must supply the min and max
values. For example, to obtain all likes greater than 250 but less than 1000 the min and max must be supplied:

```shell
curl -X GET http://localhost:3000/db/docstore/query -H "Content-Type:application/json" --data '{"propname":"likes", "comp":"range", "values":[250,1000]}'
```

```json
[{"site":"https://ipfs.io","likes":400,"project":"IPFS"},{"site":"https://github.com/orbitdb/orbit-db","likes":200,"project":"OrbitDB"}]
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

Creates a new database and returns information about the newly created database
or opens an existing database with the same name.

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

To open an existing database, specify the address of the database. If the
database does not exist locally it will be fetched from the swarm.

The address MUST be URL escaped.

```shell
curl -X POST http://localhost:3000/db/zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq%2Fdocstore
```

By default, OrbitDB will open the database if one already exists with the same
name. To always overwrite the existing database with a new one, pass the
overwrite flag:

```shell
curl http://localhost:3000/db/docstore -d "create=true" -d "type=docstore" -d "overwrite=true"
```

### GET /db/:dbname/iterator

Gets items from an eventlog or feed database :dbname.

Returns a list of matching objects as a JSON array.

Can only be used on eventlog|feed.

```shell
curl -X GET http://localhost:3000/db/feed/iterator
```

```json
[{"IPFS":"https://ipfs.io"}]
```

Additional options can be passed to OrbitDB to return different entries.

```shell
curl -X GET http://localhost:3000/db/feed/iterator -d 'limit=-1'
```

```json
[{"OrbitDB":"https://github.com/orbitdb/orbit-db"},{"IPFS":"https://ipfs.io"}]
```

See [OrbitDB's Iterator API](https://github.com/orbitdb/orbit-db/blob/master/API.md#iteratoroptions-1)
for more information.

### POST|PUT /db/:dbname/add

Adds a new entry to the eventlog or feed database :dbname.

Returns the multihash of the new record entry.

Can only be used on eventlog|feed

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

### POST|PUT /db/:dbname/inc

Increments the counter database :dbname by 1.

Returns a multihash of the new counter value.

```shell
curl -X POST http://localhost:3000/db/counter/inc
```

```json
zdpuAmHw9Tcc4pyVjcVX3rJNJ7SGffmu4EwjodzmaPBVGGzbd
```

### POST|PUT /db/:dbname/inc/:val

Increments the counter database :dbname by :val.

Returns a multihash of the new counter value.

```shell
curl -X POST http://localhost:3000/db/counter/inc/100
```

```json
zdpuAmHw9Tcc4pyVjcVX3rJNJ7SGffmu4EwjodzmaPBVGGzbd
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
