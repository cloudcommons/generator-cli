var terraform = require('./terraform');
var merge = require('./merge');

/**
 * Wraps a key and value into a workspace property, merging any existing siblings
 * @param {*} config Yeoman configuration
 * @param {*} key Object key
 * @param {*} value Object value
 */
function scopeToWorkspace(generator, workspace, key, value) {    
    var result = {};
    result[key] = value;
    var siblings = generator.config.get(workspace);
    if (siblings) {
        result = merge(siblings, result);
    }

    return result;
}

module.exports = {
    /**
     * Retrieves a Yeoman configuration, scoped to current Terraform workspace
     * @param {*} generator 
     * @param {*} key 
     * @param {*} defaultValue 
     */
    get: function (generator, key) {
        var workspace = terraform.workspace(generator);
        var envConfig = generator.config.get(workspace);
        return envConfig && envConfig[key] ? envConfig[key] : null;
    },
    /**
     * Helper for questions to retrieve the default value previously introduced by the user, for the Terraform workspace
     * @param {*} generator 
     * @param {*} key 
     * @param {*} defaultValue 
     */
    getDefault: function (generator, key, defaultValue) {
        var generatorConfig = this.get(generator, generator.configName);
        generator.log(JSON.stringify(generatorConfig));
        return generatorConfig && generatorConfig[key] ? generatorConfig[key] : defaultValue;
    },
    /**
     * Sets a value into Yeoman configuration, scoped to current Terraform workspace 
     * @param {*} generator 
     * @param {*} key 
     * @param {*} value 
     */
    set: function (generator, key, value) {
        var workspace = terraform.workspace(generator);
        value = scopeToWorkspace(generator, workspace, key, value);
        generator.config.set(workspace, value);
    },
    /**
     * Gets a value from Yeoman configuration
     * @param {*} generator 
     * @param {*} key 
     * @param {*} defaultValue 
     */
    getGlobal: function (generator, key, defaultValue) {
        const value = generator.config.get(key);
        return value ? value : defaultValue;
    },
    /**
     * Sets a value into Yeoman configuration
     * @param {*} generator 
     * @param {*} key 
     * @param {*} value 
     */
    setGlobal: function (generator, key, value) {
        generator.config.set(key, value);
    },
    /**
     * Persists Yeoman configuration changes
     * @param {*} generator 
     */
    save: function (generator) {
        generator.config.save();
    }
}