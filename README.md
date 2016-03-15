# bitflyer-node

wrapper of bitFlyer APIs

## Caution:

__this is not implemented trade api yet__

## Dependencies

* [request](https://www.npmjs.com/package/request)
* [pubnub](https://www.npmjs.com/package/pubnub)

## How to use

### at first

```
$ npm install
```

### example

```
var bitflyer = require('bitflyer-node');

// REST API
// if you don't give api key and secret, then you can use only public api
var rest = new bitflyer.REST('YOUR_API_KEY', 'YOUR_API_SECRET');
rest.getBalance(function(err, data) {
	if(err) return console.error(err);
	console.log(data);
});

// Streaming API
var streaming = new bitflyer.Streaming();
streaming.subscribeTicker(function(err, data) {
	if(err) return console.error(err);
	console.log(data);
});

```

## APIs

* [official api reference](https://lightning.bitflyer.jp/docs?lang=en)

### REST (Public)

#### getHealth(callback)

* `callback` is function as `function(err, data)`.

#### getChatLog(callback [, from_date])

* `callback` is function as `function(err, data)`.

* optional: `from_date` is number. default is `5`.

#### getBoard(callback [, paging])
#### getTicker(callback [, paging])
#### getExecutions(callback [, paging])
#### getBoardFx(callback [, paging])
#### getTickerFx(callback [, paging])
#### getExecutionsFx(callback [, paging])

* `callback` is function as `function(err, data)`.
* optional: `paging` is object as:

```
{
	count: number,
	before: id,
	after: id
}
``` 
* see [paging detail](https://lightning.bitflyer.jp/docs?lang=en#pagination)

### REST (Private)

#### getPermissions(callback)
#### getBalance(callback)
#### getCollateral(callback)
#### getAddresses(callback)

* `callback` is function as `function(err, data)`.

#### getCoinIns(callback [, paging])
#### getCoinOuts(callback [, paging])
#### getDeposits(callback [, paging])
#### getWithDrawals(callback [, paging])

* `callback` is function as `function(err, data)`.
* optional: `paging` is object as:

```
{
	count: number,
	before: id,
	after: id
}
``` 
* see [paging detail](https://lightning.bitflyer.jp/docs?lang=en#pagination)

#### getChildOrders
#### getParentOrders
#### getParentOrder
#### getExecutions
#### getPositions

* not implemented now

#### sendChildOrder
#### cancelChildOrder
#### sendParentOrder
#### cancelParentOrder
#### cancelAllChildOrders

* not implemented now

### Streaming

#### subscribeBoardSnapshot(callback)
#### subscribeBoard(callback)
#### subscribeTicker(callback)
#### subscribeExecutions(callback)
#### subscribeBoardSnapshotFx(callback)
#### subscribeBoardFx(callback)
#### subscribeTickerFx(callback)
#### subscribeExecutionsFx(callback)

* `callback` is function as `function(err, data)`.

## Update history

### 2016/03/15 ver 0.0.3 release

* oops again


### 2016/03/15 ver 0.0.2 release

* oops

### 2016/03/15 ver 0.0.1 release

* initial

## License

MIT License.

## Author

* ISHII 2bit [bufferRenaiss co., ltd. / backspace.tokyo]
* 2bit@backspace.tokyo

## At the last

Please create a new issue if there is a problem.
And please throw a pull request if you have a cool idea!!

### if you love this

386iAzZ7m99sMyUQjM7TrZg1Uft518zpgv
