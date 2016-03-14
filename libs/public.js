var common = require('./common'),
    request = require('request');

var base_url = common.base_url,
    Method = common.Method,
    Pathes = {
        GET: {
            board: '/v1/getboard?product_code=BTC_JPY',
            ticker: '/v1/getticker?product_code=BTC_JPY',
            executions: '/v1/getexecutions?product_code=BTC_JPY',
            board_fx: '/v1/getboard?product_code=FX_BTC_JPY',
            ticker_fx: '/v1/getticker?product_code=FX_BTC_JPY',
            executions_fx: '/v1/getexecutions?product_code=FX_BTC_JPY',
            health: '/v1/gethealth',
            chatlog: '/v1/getchats'
        }
    };

var REST = function() {};

var rest_prototype = {
    raw_request_public: function(callback, method, path, body) {
        callback = callback || function(err, response, payload) {};
        var options = {
            url: base_url + path,
            method: method,
            body: "",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var wrapped_callback = (function(callback) {
            return function(err, response, payload) {
                if (err) return callback(err);

                var data = null;
                try {
                    data = JSON.parse(payload);
                } catch(err) {
                    return callback({message: "can't parse to json", body: payload});
                }

                callback(null, data);
            };
        })(callback);

        request(options, wrapped_callback);
        return this;
    },
    getHealth: function(callback) {
        return this.raw_request_public(callback, Method.GET, Pathes.GET.health);
    },
    getChatLog: function(callback, from_date) {
        from_date = from_date || 5;
        return this.raw_request_public(callback, Method.GET, Pathes.GET.chatlog + "?from_date=" + from_date);
    }
};

function create_get_method_with_paging(path) {
    return function(callback, paging) {
        return this.raw_request_public(callback, Method.GET, Pathes.GET[path] + common.create_paging_option(paging));
    };
}

['board', 'ticker', 'executions', 'board_fx', 'ticker_fx', 'executions_fx'].forEach(function(key) {
    var method_name = 'get' + key.split("_").reduce(function(result, next) { return result + common.camelize_mod(next); }, '');
    rest_prototype[method_name] = create_get_method_with_paging(key);
});

for(var key in rest_prototype) if(rest_prototype.hasOwnProperty(key)) {
    REST.prototype[key] = rest_prototype[key];
}

module.exports = {
    REST: REST
};