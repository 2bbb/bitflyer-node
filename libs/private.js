var util = require('util'),
    crypto = require('crypto'),
    request = require('request'),
    public_rest = require('./public'),
    common = require('./common');

var base_url = common.base_url,
    Method = common.Method,
    Pathes = {
        GET: {
            permissions: '/v1/me/getpermissions',
            balance: '/v1/me/getbalance',
            collateral: '/v1/me/getcollateral',
            addresses: '/v1/me/getaddresses',
            coin_ins: '/v1/me/getcoinins',
            coin_outs: '/v1/me/getcoinouts',
            deposits: '/v1/me/getdeposits',
            with_drawals: '/v1/me/getwithdrawals',
            child_orders: '/v1/me/getchildorders',
            parent_orders: '/v1/me/getparentorders',
            parent_order: '/v1/me/getparentorder',
            executions: '/v1/me/getexecutions',
            positions: '/v1/me/getpositions',
        },
        POST: {
            send_child_order: '/v1/me/sendchildorder',
            cancel_child_order: '/v1/me/cancelchildorder',
            send_parent_order: '/v1/me/sendparentorder',
            cancel_parent_order: '/v1/me/cancelparentorder',
            cancel_all_child_orders: '/v1/me/cancelallchildorders',
        }
    };

var REST = function(key, secret) {
    this.key    = key || "";
    this.secret = secret || "";
    this.permissions = null;
    if(key != "" && secret != "") {
        this.getPermissions(function (err, data) {
            if (err) return console.error(err);
            this.permissions = data;
        });
    } else {
        this.permissions = [];
    }
};

util.inherits(REST, public_rest.REST);

var rest_prototype = {
    raw_request_private: function(callback, method, path, body) {
        if(this.permissions && this.permissions.indexOf(path) == -1) {
            return callback({message: 'permission denied.', api: path});
        }
        body = body || "";
        callback = callback || function(err, response, payload) {};
        var timestamp = Date.now().toString();
        var text = timestamp + method + path + body;
        var sign = crypto.createHmac('sha256', this.secret).update(text).digest('hex');

        var options = {
            url: base_url + path,
            method: method,
            body: body,
            headers: {
                'ACCESS-KEY': this.key,
                'ACCESS-TIMESTAMP': timestamp,
                'ACCESS-SIGN': sign,
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

                if (data.status == -500) {
                    return callback({message: "invalid api key", body: payload});
                }

                callback(null, data);
            };
        })(callback);

        request(options, wrapped_callback);
        return this;
    }
};

function create_get_method_with_no_arguments(key) {
    return function(callback) {
        return this.raw_request_private(callback, Method.GET, Pathes.GET[key]);
    };
}

['permissions', 'balance', 'collateral', 'addresses'].forEach(function(key) {
    var method_name = 'get' + common.camelize_mod(key);
    rest_prototype[method_name] = create_get_method_with_no_arguments(key);
});

function create_get_method_with_paging(path) {
    return function(callback, paging) {
        return this.raw_request_private(callback, Method.GET, Pathes.GET[path] + common.create_paging_option(paging));
    };
}

['coin_ins', 'coin_outs', 'deposits', 'with_drawals'].forEach(function(key) {
    var method_name = 'get' + key.split("_").reduce(function(result, next) { return result + common.camelize_mod(next); }, '');
    rest_prototype[method_name] = create_get_method_with_paging(key);
});


for(var key in rest_prototype) if(rest_prototype.hasOwnProperty(key)) {
    REST.prototype[key] = rest_prototype[key];
}

module.exports = {
    REST: REST
};