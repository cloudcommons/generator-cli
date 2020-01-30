var config = require('./config');
var az = require('./az');
var terraform = require('./terraform');
var resources = {};

module.exports = {
    load: function (generator) {
        resources = config.get(generator, "resources");
        if (!resources || !typeof resources === "object") {
            resources = {};
        }
    },
    save: function (generator) {
        config.set(generator, "resources", resources);
    },
    get: function (type) {
        var result = resources[type];
        return result ? result : []
    },
    push: function (type, name) {
        if (!resources[type]) {
            resources[type] = [name];
        }
        else {
            if (!resources[type].includes(name)) {
                resources[type].push(name);
            }
        }
    },
    keys: function () {
        return Object.keys(resources);
    },
    resourceGroups(generator) {
        return this.get('azurerm_resource_group').concat(az.resourceGroups(generator));
    },
    sqlServers(generator, resourceGroup) {
        if (terraform.isDependency(resourceGroup)) {
            return this.get('azurerm_sql_server');
        }
        else {
            return az.sqlServers(generator, resourceGroup);
        }
    }
}