# Upgrade Notes

## From Flocore 3.0.0 to 4.0.0

`flocore-node@2.1.1` to `flocore-node@3.0.0`

This major upgrade includes changes to indexes, API methods and services. Please review below details before upgrading.

### Indexes

Indexes include *more information* and are now also *faster*. Because of this a **reindex will be necessary** when upgrading as the address and database indexes are now a part of florincoind with three new `florincoin.conf` options:
- `-addressindex`
- `-timestampindex`
- `-spentindex`

To start reindexing add `reindex=1` during the **first startup only**.

### Configuration Options

- The `florincoin.conf` file in will need to be updated to include additional indexes *(see below)*.
- The `datadir` option is now a part of `florincoind` spawn configuration, and there is a new option to connect to multiple florincoind processes (Please see [Florincoin Service Docs](services/florincoind.md) for more details). The services `db` and `address` are now a part of the `florincoind` service. Here is how to update `flocore-node.json` configuration options:

**Before**:
```json
{
  "datadir": "/home/<username>/.florincoin",
  "network": "livenet",
  "port": 3001,
  "services": [
    "address",
    "florincoind",
    "db",
    "web"
  ]
}
```

**After**:
```json
{
  "network": "livenet",
  "port": 3001,
  "services": [
    "florincoind",
    "web"
  ],
  "servicesConfig": {
    "florincoind": {
      "spawn": {
        "datadir": "/home/<username>/.florincoin",
        "exec": "/home/<username>/flocore-node/bin/florincoind"
      }
    }
  }
}
```

It will also be necessary to update `florincoin.conf` settings, to include these fields:
```
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:<port>
zmqpubhashblock=tcp://127.0.0.1:<port>
rpcallowip=127.0.0.1
rpcuser=<user>
rpcpassword=<password>
```

**Important**: Once changes have been made you'll also need to add the `reindex=1` option **only for the first startup** to regenerate the indexes. Once this is complete you should be able to remove the `flocore-node.db` directory with the old indexes.

### API and Service Changes
- Many API methods that were a part of the `db` and `address` services are now a part of the `florincoind` service. Please see [Florincoin Service Docs](services/florincoind.md) for more details.
- The `db` and `address` services are deprecated, most of the functionality still exists. Any services that were extending indexes with the `db` service, will need to manage chain state itself, or build the indexes within `florincoind`.
