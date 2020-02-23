
const jsonMerge = require('./merge');
const axios = require('axios');
const regex = require('../core/regex');
var workspace = null;

/**
* Reads the given jsonFile from the fs and merges it with the incoming json object
* @param {*} fs File system
* @param {*} incomingJson Incoming Json object to merge
* @param {*} jsonFile File to read and merge
* @param {*} mergeAt Property that should be merged. The rest of properties will be ignored
*/
function merge(fs, incomingJson, jsonFile, mergeAt = null) {
    var fsJson = fs.readJSON(jsonFile, {});
    return jsonMerge(fsJson, incomingJson, mergeAt);
}

/**
 * Writes the given JSON object into the file system
 * @param {*} fs File system
 * @param {*} file File name
 * @param {*} json JSON object to write
 */
function write(fs, file, json) {
    fs.writeJSON(file, json);
}

module.exports = class {

    constructor(fs, spawn, log) {
        this.fs = fs;
        this.spawn = spawn;
        this.log = log;
    }

    /**
  * Spawns a terraform command
  * @param {*} args
  */
    terraform(args) {
        var rgs = this.spawn('terraform', args, {
            stdio: ['ignore', 'pipe', process.stderr]
        });

        if (rgs.output === null) throw "No response from terraform. Is terraform installed??";
        var output = rgs.output.toString().trim();
        return output.substring(1, output.length - 2);
    }

    /**
     * Returns the current terraform workspace
     */
    getWorkspace() {
        if (workspace != null) {
            return workspace;
        }

        workspace = this.terraform(['workspace', 'show']);
        if (workspace == null) {
            workspace = "default";
        }

        return workspace;
    }

    createWorkspace(workspace) {
        return workspace = this.terraform(['workspace', 'new', workspace]);
    }

    /**
     * Merges the given json config object into a tfvars.json
     * @param {*} config Configuration JSON object to merge
     * @param {*} file Terraform JSON configuration file to merge. Defaults to 'terraform.tfvars.json'
     */
    writeConfig(config, file = 'terraform.tfvars.json') {
        var merged = merge(this.fs, config, file);
        write(this.fs, file, merged);
    }

    /**
     * Writes the given json variables object into a tf.json
     * @param {*} variables Variables JSON object to merge
     * @param {*} file Terraform variables file to merge. Defaults to 'variables.tf.json'
     */
    writeVariables(variables, file = 'variables.tf.json') {
        var merged = merge(this.fs, variables, file, "variable");
        write(this.fs, file, merged);
    }

    /**
     * Writes the given json backend object into a tf.json
     * @param {*} backend 
     * @param {*} file 
     */
    writeBackEnd(backend, file = "__init__.tf.json") {
        var merged = merge(this.fs, backend, file);
        write(this.fs, file, merged);
    }

    /**
     * Writes the given json outputs object into a tf.json
     * @param {*} output outputs JSON object to merge
     * @param {*} file Terraform variables file to merge. Defaults to 'output.tf.json'
     */
    writeOutput(output, file = 'output.tf.json') {
        var merged = merge(this.fs, output, file, "output");
        write(this.fs, file, merged);
    }

    /**
     * Writes the given json outputs object into a tf.json
     * @param {*} providers providers to merge
     * @param {*} file Terraform variables file. Defaults to 'provider.tf.json'
     */
    writeProviders(providers, file = 'providers.tf.json') {
        var merged = merge(this.fs, providers, file, "provider");
        write(this.fs, file, merged);
    }

    /**
     * Initialises the current terraform folder
     * @param {*} log 
     * @param {*} spawnCommandSync 
     */
    init() {
        this.log("Initialising Terraform...")
        try {
            this.spawn('terraform', ['init']);
        }
        catch (e) {
            this.log("Error executing terraform init. Is terraform installed? ", e);
        }
    }

    /**
     * Turns a Javascript string into a Terraform variable notation
     * @param {*} string String to convert into Terraform string variable
     */
    toVariable(string) {
        return "${" + string + "}"
    }

    /**
     * Generates a key valid value from a string
     * @param {*} string 
     */
    generateKey(string) {
        if (!string) return null;
        return string.replace(/[\s!*.,#\\/!]+/g, '-').toLowerCase();
    }

    /**
     * Validates if the given string meets the regular expression criteria to act as terraform resource name
     * @param {*} string 
     */
    validateKey(string) {
        if (string && string.match("^([a-z][a-z0-9]*)(-[a-z0-9]+)*$")) return true;
        else return "Invalid name. Object names should meet kebab casing. Lower case only (^([a-z][a-z0-9]*)(-[a-z0-9]+)*$)";
    }

    /**
     * Imports an azureid into the given terraform resource     
     * @param {*} name Terraform resource name
     * @param {*} azureId Azure resource id
     */
    import(name, azureId) {
        this.log(`terraform import ${name} ${azureId}`);
        return terraform(['import', name, azureId]);
    }

    /**
     * Given a parameter, finds out if it is a reference to another Terraform. If it is, returns that value. Variable otherwise.
     * @param {*} dependency Original variable
     * @param {*} value Resolved dependency
     * @param {*} variable Variable to use if this is not a dependency
     */
    resolveDependency(dependency, value, variable) {
        return this.isDependency(dependency) ? value : variable;
    }


    /**
     * Given a value, finds out if it a dependency with another Terraform resource 
     * @param {*} value 
     */
    isDependency(value) {
        return value && value.includes('.');
    }

    /**
     * Method used by configuration classes to put the right values into .tfvars.json
     * Internal dependencies will resolve to "undefiend", which in turn will make JavaScript no to create write the property to the .tfvar.json
     * @param {*} dependency 
     * @param {*} value 
     */
    resolveConfigDependency(value) {
        return !this.isDependency(value) ? value : undefined
    }

    createVariables(varFile, configFile, organisation, workspace, token) {
        var vars = require(varFile);
        var config = {};
        try { config = require(configFile); } catch { }
        var keys = Object.keys(vars.variable);
        var client = getInstance(token);

        client.get(`/organizations/${organisation}/workspaces/${workspace}`)            
            .then(function (response) {
                var variables = [];
                for (var i = 0; i < keys.length; i++) {
                    var ws = response.data.data;
                    var key = keys[i];
                    var variable = vars.variable[key];
                    var value = config[key] !== undefined ? config[key] : variable.default !== undefined ? variable.default : null;
                    variables.push(getVariable(ws.id, key, "terraform", variable.description, value, false, false));
                }

                createVars(client, variables);
            })
            .catch(e => this.log("Error getting organisation data"));
    }

    createAzureRmVariables(organisation, workspace, token) {
        var client = getInstance(token);
        client.get(`/organizations/${organisation}/workspaces/${workspace}`)            
            .then(function (response) {
                var variables = [];
                var ws = response.data.data;
                variables.push(getVariable(ws.id, "ARM_CLIENT_ID", "env", "(Required) The Client ID which should be used. This can also be sourced from the ARM_CLIENT_ID Environment Variable."))
                variables.push(getVariable(ws.id, "ARM_TENANT_ID", "env", "(Required) The Tenant ID which should be used. This can also be sourced from the ARM_TENANT_ID Environment Variable."))
                variables.push(getVariable(ws.id, "ARM_CLIENT_SECRET", "env", "(Required) The Client ID which should be used. This can also be sourced from the ARM_CLIENT_SECRET Environment Variable.", null, false ,true))
                variables.push(getVariable(ws.id, "ARM_SUBSCRIPTION_ID", "env", "(Required) The Client ID which should be used. This can also be sourced from the ARM_SUBSCRIPTION_ID Environment Variable."))
                createVars(client, variables);
            })
            .catch(e => this.log("Error getting organisation data"));
    }
}

function getVariable(workspaceId, key, category, description, value = null, hcl = false, sensitive = false) {
    sensitive = regex.looksSensitive(key) || sensitive; // Any secret that looks sensitive, will be sent to terraform as such
    hcl = regex.looksLikeTerraformObject(value) || hcl;
    value = hcl ? JSON.stringify(value) : value; // HCL variables are not JSON friendly and should be serialised properly
    return {
        "data": {
            "type": "vars",
            "attributes": {
                "key": key,
                "value": value,
                "category": category,
                "description": description,
                "hcl": hcl,
                "sensitive": sensitive
            },
            "relationships": {
                "workspace": {
                    "data": {
                        "id": workspaceId,
                        "type": "workspaces"
                    }
                }
            }
        }
    };
}

function createVars(client, vars) {
    for (var i = 0; i < vars.length; i++) {        
        v = vars[i];
        client.post(`/vars`, v).catch(e => {
            if (e.response && e.response.status === 422) { // Variable already exists
                var body = JSON.parse(e.response.config.data);
                console.log(`'${body.data.attributes.key}' already exists. Skipping...`);
            }
            else {
                console.log(`Error sending variable.`);
                console.log(e.response);
            }
        });
    }
}

function getInstance(token) {
    return axios.create({
        baseURL: 'https://app.terraform.io/api/v2',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Authorization': `Bearer ${token}`
        }
    });
}