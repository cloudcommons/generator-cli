const debug = require('debug')('cloudcommons/generator-cli:resources')

function load(configManager) {
    var resources = configManager.get("resources");
    if (!resources || !typeof resources === "object") {
        resources = {};
    }

    return resources;
}

module.exports = class {
    constructor(configManager, az, terraform) {
        this.configManager = configManager;
        this.az = az;
        this.terraform = terraform;
        this.resources = load(this.configManager);        
    }

    /**
     * Saves the resources to Yeoman
     */
    save() {
        debug('Saving');
        var existing = load(this.configManager); 
        this.resources = Object.assign(existing ? existing : {}, this.resources);
        this.configManager.set("resources", this.resources);
    }

    /**
     * Gets all resources of the given type
     * @param {*} type 
     */
    get(type) {
        debug(`Getting resources of type ${type}`);
        var result = this.resources[type];
        return result ? result : []
    }

    /**
     * Pushes a new resource to the list
     * @param {*} type 
     * @param {*} name 
     */
    push(type, name) {
        debug(`Pushing type ${type} as ${name}`);
        if (!this.resources[type]) {
            this.resources[type] = [name];
        }
        else {
            if (!this.resources[type].includes(name)) {
                this.resources[type].push(name);
            }
        }
    }

    /**
     * Gets all registered object typs
     */
    keys() {
        debug(`Getting keys`);
        return Object.keys(this.resources);
    }

    /**
     * Gets all the resource groups, including local and remote
     */
    resourceGroups() {
        return this.get('azurerm_resource_group').concat(this.az.resourceGroups());
    }

    /**
     * Returns all azurerm_public_ip in this project
     */
    ipAddresses() {
        return this.get('azurerm_public_ip');
    }

    /**
     * Get all the SQL Azure servers, including local and remote
     * @param {*} resourceGroup 
     */
    sqlServers(resourceGroup) {        
        if (this.terraform.isDependency(resourceGroup)) {
            return this.get('azurerm_sql_server');
        }
        else {
            debug(`${resourceGroup} is not a dependency. Getting SQL Servers from Azure`);
            return this.az.sqlServers(resourceGroup);
        }
    }
}