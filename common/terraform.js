var jsonMerge = require('./merge');
var workspace = null;

/**
 * Spawns a terraform command
 * @param {*} generator 
 * @param {*} args 
 */
function terraform(generator, args) {
    if (workspace != null) {
        return workspace;
    }
    
    var rgs = generator.spawnCommandSync('terraform', args, {
        stdio: [process.stdout]
    });
    var output = rgs.output.toString().trim();
    workspace = output.substring(1, output.length - 2);
    if (workspace == null) {
        workspace = "default";
    }
    
    return workspace;
}

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

module.exports = {
    /**
     * Merges the given json config object into a tfvars.json
     * @param {*} fs File system
     * @param {*} config Configuration to merge
     * @param {*} file Terraform configuration file. Defaults to 'terraform.tfvars.json'
     */
    writeConfig: function (fs, config, file = 'terraform.tfvars.json') {
        var merged = merge(fs, config, file);
        write(fs, file, merged);
    },
    /**
     * Writes the given json variables object into a tf.json
     * @param {*} fs File system
     * @param {*} variables Variables to merge
     * @param {*} file Terraform variables file. Defaults to 'variables.tf.json'
     */
    writeVariables: function(fs, variables, file = 'variables.tf.json') {
        var merged = merge(fs, variables, file, "variable");
        write(fs, file, merged);
    },
    /**
     * Writes the given json outputs object into a tf.json
     * @param {*} fs File system
     * @param {*} output outputs to merge
     * @param {*} file Terraform variables file. Defaults to 'output.tf.json'
     */
    writeOutput: function(fs, output, file = 'output.tf.json') {
        var merged = merge(fs, output, file, "output");
        write(fs, file, merged);
    },
    /**
     * Writes the given json outputs object into a tf.json
     * @param {*} fs File system
     * @param {*} providers providers to merge
     * @param {*} file Terraform variables file. Defaults to 'provider.tf.json'
     */
    writeProviders: function(fs, providers, file = 'providers.tf.json') {
        var merged = merge(fs, providers, file, "provider");
        write(fs, file, merged);
    },    
    /**
     * Initialises the current terraform folder
     * @param {*} log 
     * @param {*} spawnCommandSync 
     */
    init: function (log, spawnCommandSync) {
        log("Initialising Terraform...")
        try {
            spawnCommandSync('terraform', ['init']);
        }
        catch (e) {
            log("Error executing terraform init. Is terraform installed? ", e);
        }
    },
    /**
     * Turns a Javascript string into a Terraform variable notation
     * @param {*} string String to convert into Terraform string variable
     */
    toVariable: function(string) {
        return "${" + string + "}"
    },
    /**
     * Returns the current Terraform workspace
     */
    workspace: function(generator) {
        if (!workspace) {
            workspace = terraform(generator, ['workspace', 'show']);
        }

        return workspace;
    }   
}