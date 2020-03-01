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

module.exports = class {
    constructor(generator, terraform) {
        this.generator = generator;
        this.terraform = terraform;
    }

    /**
     * Retrieves a Yeoman configuration, scoped to current Terraform workspace
     * @param {*} key 
     */
    get(key) {
        var workspace = this.terraform.getWorkspace();
        var envConfig = this.generator.config.get(workspace);
        return envConfig && envConfig[key] ? envConfig[key] : null;
    }

    /**
     * Helper for questions to retrieve the default value previously introduced by the user, for the Terraform workspace
     * @param {*} key 
     * @param {*} defaultValue 
     */
    getDefault(key, defaultValue) {
        if (typeof(defaultValue) === "function") defaultValue = defaultValue();
        var generatorConfig = this.get(this.generator.configName);
        if (this.generator.options[key] !== undefined) return this.generator.options[key];
        return generatorConfig && generatorConfig[key] ? generatorConfig[key] : defaultValue;
    }

    /**
     * Sets a value into Yeoman configuration, scoped to current Terraform workspace 
     * @param {*} key 
     * @param {*} value 
     */
    set(key, value) {
        var workspace = this.terraform.getWorkspace();
        value = scopeToWorkspace(this.generator, workspace, key, value);
        this.generator.config.set(workspace, value);
    }

    /**
     * Gets a value from Yeoman configuration
     * @param {*} generator 
     * @param {*} key 
     * @param {*} defaultValue 
     */
    getGlobal(key, defaultValue) {
        const value = this.generator.config.get(key);
        return value ? value : defaultValue;
    }

    /**
     * Sets a value into Yeoman configuration
     * @param {*} key 
     * @param {*} value 
     */
    setGlobal(key, value) {
        this.generator.config.set(key, value);
    }

    /**
     * Persists Yeoman configuration changes
     * @param {*} generator 
     */
    save() {
        this.generator.config.save();
    }
}