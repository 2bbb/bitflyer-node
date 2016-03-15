function camelize_mod(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

function create_paging_option(paging) {
    var opt = "";
    for(var key in paging) {
        opt += "&" + key + "=" + paging[key];
    }
    return opt;
}

module.exports = {
    camelize_mod: camelize_mod,
    create_paging_option: create_paging_option,
    query: function(queries, is_append) {
        is_append = is_append || false;
        var res = [];
        for(var key in queries) {
            res.push(key + "=" + queries[key]);
        }
        return (is_append ? "" : "?") + res.join("&");
    },
    base_url: 'https://api.bitflyer.jp/v1',
    Method: {
        GET: 'GET',
        POST: 'POST'
    },
    ProductCode: {
        actual: "BTC_JPY",
        fx: "FX_BTC_JPY"
    },
    ServerStatus: {
        NORMAL: "NORMAL",
        BUSY: "BUSY",
        VERY_BUSY: "VERY BUSY",
        STOP: "STOP"
    }
};