var util = require('util');
var public_rest = require('./libs/public'),
    private_rest = require('./libs/private'),
    streaming = require('./libs/streaming');

module.exports = {
    PublicRest: public_rest.REST,
    REST: private_rest.REST,
    Streaming: streaming.Streaming
};