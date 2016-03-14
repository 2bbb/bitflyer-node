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
    base_url: 'https://api.bitflyer.jp',
    Method: {
        GET: 'GET',
        POST: 'POST'
    }
};