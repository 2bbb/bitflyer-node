var common = require('./common'),
    ProductCode = common.ProductCode;

Object.prototype.containsValue = function(value) {
    for(var key in this) {
        if(this[key] == value) return true;
    }
    return false;
};

function create_error(error, message, detail) {
    return {error: error, message: message, detail: detail};
}

function invalid_argument(arg_name, value) {
    return create_error('invalid argument', arg_name + ' is invalid', value);
}

var ChildOrderType = {
        Limit: "LIMIT",
        Market: "MARKET"
    },
    Side = {
        Buy: "BUY",
        Sell: "SELL"
    },
    TimeInForce = {
        GoodTilCanceled: "GTC",
        GTC: "GTC",
        ImmediateOrCancel: "IOC",
        IOC: "IOC",
        FillOrKill: "FOK",
        FOK: "FOK"
    },
    ChildOrderState = {
        Active: "ACTIVE",
        Completed: "COMPLETED",
        Canceled: "CANCELED",
        EXPIRED: "EXPIRED",
        REJECTED: "REJECTED"
    };

function create_child_order(product_code, child_order_type, side, price, size, minute_to_expire, time_in_force) {
    if(!ProductCode.containsValue(product_code)) {
        return invalid_argument('product_code', product_code);
    }
    if(!ChildOrderType.containsValue(child_order_type)) {
        return invalid_argument('child_order_type', child_order_type);
    }
    if(!Side.containsValue(side)) {
        return invalid_argument('side', side);
    }
    if(price && typeof price != "number") {
        return invalid_argument('price', price);
    }
    if(price <= 0) {
        return invalid_argument('price', price);
    }
    if(size && typeof size != "number") {
        return invalid_argument('size', size);
    }
    if(size <= 0) {
        return invalid_argument('size', size);
    }
    if(minute_to_expire && typeof minute_to_expire != "number") {
        return invalid_argument('minute_to_expire', minute_to_expire);
    }
    if(minute_to_expire <= 0) {
        return invalid_argument('minute_to_expire', minute_to_expire);
    }
    if(time_in_force && !TimeInForce.containsValue(time_in_force)) {
        return invalid_argument('time_in_force', time_in_force);
    }
    minute_to_expire = minute_to_expire || 525600;
    time_in_force = time_in_force || TimeInForce.GTC;
    return {
        product_code: product_code,
        child_order_type: child_order_type,
        side: side,
        price: price,
        size: size,
        minute_to_expire: expire,
        time_in_force: time_in_force
    };
}

function create_child_order_group(product_code) {
    return {
        buy: function (order_type, price, size, minute_to_expire, time_in_force) {
            return create_child_order(product_code, order_type, Side.Buy, price, size, minute_to_expire, time_in_force);
        },
        buyLimit: function (price, size, minute_to_expire, time_in_force) {
            return this.buy(ChildOrderType.Limit, price, size, minute_to_expire, time_in_force);
        },
        buyMarket: function (price, size, minute_to_expire, time_in_force) {
            return this.buy(ChildOrderType.Market, price, size, minute_to_expire, time_in_force);
        },
        cancelByOrderId: function(child_order_id) {
            return {
                product_code: product_code,
                child_order_id: child_order_id
            };
        },
        cancelByOrderAcceptanceId: function(child_order_acceptance_id) {
            return {
                product_code: product_code,
                child_order_acceptance_id: child_order_acceptance_id
            };
        },
        cancelAll: function () {
            return {product_code: product_code};
        },
        get: function(paging) {
            var option = { product_code: product_code };
            if(paging) {
                for(var key in paging) {
                    option[key] = paging[key];
                }
            }
            return option;
        },
        getByState: function(child_order_state, paging) {
            if(!ChildOrderState.containsValue(child_order_state)) {
                return invalid_argument("child_order_state", child_order_state);
            }
            var res = this.get(paging);
            res.child_order_state = child_order_state;
        },
        getByParentID: function(parent_order_id, paging) {
            if(!parent_order_id) {
                return invalid_argument("parent_order_id", parent_order_id);
            }
            var res = this.get(paging);
            res.parent_order_id = parent_order_id;
        }
    }
}

module.exports = {
    ChildOrder: {
        Actual: create_child_order_group(ProductCode.actual),
        Fx: create_child_order_group(ProductCode.fx)
    }
};