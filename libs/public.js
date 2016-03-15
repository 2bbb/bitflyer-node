var common = require('./common'),
    request = require('request');

var base_url = common.base_url,
    Method = common.Method,
    ProductCode = common.ProductCode,
    query = common.query,
    Pathes = {
        GET: {
            board: '/getboard' + query({product_code: ProductCode.actual}),
            ticker: '/getticker' + query({product_code: ProductCode.actual}),
            executions: '/getexecutions' + query({product_code: ProductCode.actual}),
            board_fx: '/getboard' + query({product_code: ProductCode.fx}),
            ticker_fx: '/getticker' + query({product_code: ProductCode.fx}),
            executions_fx: '/getexecutions' + query({product_code: ProductCode.fx}),
            health: '/gethealth',
            chatlog: '/getchats'
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