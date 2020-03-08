module.exports.kubernetes = function (config = null) {
    var provider = {
        version: "~> 1.11.1"
    };

    if (config != null) {
        config = Object.assign(provider, config);
    }

    return config;
}

module.exports.azurerm = function () {
    return {
        version: "~> 2.0",
        features: {}
    };
}

module.exports.null = function () {
    return {
        version: "~> 2.1"
    };
}

module.exports.local = function () {
    return {
        version: "~> 1.4"
    };
}

module.exports.helm = function (kubernetes = {}) {
    return {
        version: "~> 1.0.0",
        kubernetes: kubernetes
    }
}

module.exports.template = function () {
    return {
        version: "~> 2.1"
    };
}