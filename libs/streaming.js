var PubNub = require('pubnub');
var pubnub = PubNub({
    subscribe_key: "sub-c-52a9ab50-291b-11e5-baaa-0619f8945a4f"
});

var channels = {
	subscribeBoardSnapshot: "lightning_board_snapshot_BTC_JPY",
	subscribeBoard: "lightning_board_BTC_JPY",
	subscribeTicker: "lightning_ticker_BTC_JPY",
	subscribeExecutions: "lightning_executions_BTC_JPY",
	subscribeBoardSnapshotFx: "lightning_board_snapshot_FX_BTC_JPY",
	subscribeBoardFx: "lightning_board_FX_BTC_JPY",
	subscribeTickerFx: "lightning_ticker_FX_BTC_JPY",
	subscribeExecutionsFx: "lightning_executions_FX_BTC_JPY"
};


function subscribe(channel, callback) {
	pubnub.subscribe({
		channel: channel,
		message: function(data) { callback(null, data); },
		error: callback
	});
}

function create_subscribe_method(channel) {
	return function(callback) {
		subscribe(channel, callback);
		return this;
	};
}

function Streaming() {}

for(var method_name in channels) if(channels.hasOwnProperty(method_name)) {
	Streaming.prototype[method_name] = create_subscribe_method(channels[method_name]);
}

module.exports = {
	Streaming: Streaming
};