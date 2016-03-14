var private = require('../libs/private');

var rest = new private.REST("", "");
rest
    .getHealth(function(err, data) {
        if(err) {
            console.error(err);
            return;
        }
        console.log(data);
    })
    .getTicker(function(err, data) {
        if(err) {
            console.error(err);
            return;
        }
        console.log(data);
    })
    .getWithDrawals(function(err, data) {
        if(err) {
            console.error(err);
            return;
        }
        console.log(data);
    });

var Streaming = require('../libs/streaming').Streaming;
var streaming = new Streaming();
//streaming.subscribeBoard(function(err, data) {
//    if(err) {
//        console.error(err);
//        return;
//    }
//    console.log(data);
//})
