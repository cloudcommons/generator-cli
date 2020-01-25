/**
 * Combines a json object with the content of a json file
 * @param {*} fs File system
 * @param {*} jsonObject JSON Object to merge
 * @param {*} jsonFile JSON file to merge
 */
function merge(fs, jsonObject, jsonFile, mergeDefault = {}) {
    var sourceJson = fs.readJSON(jsonFile, {});
    var merged = Object.assign(mergeDefault, sourceJson, jsonObject);
    fs.writeJSON(jsonFile, merged);
}


module.exports = {
    /**
     * Merges the given json config object into a tfvars.json
     * @param {*} fs File system
     * @param {*} config Configuration to merge
     * @param {*} file Terraform configuration file. Defaults to 'terraform.tfvars.json'
     */
    writeConfig: function (fs, config, file = 'terraform.tfvars.json') {
        merge(fs, config, file);
    },
    /**
     * Writes 
     * @param {*} fs File system
     * @param {*} variables Variables to merge
     * @param {*} file Terraform variables file. Defaults to 'variables.tf.json'
     */
    writeVariable: function(fs, variables, file = 'variables.tf.json') {
        merge(fs, variables, file);
    },
    init: function (log, spawnCommandSync) {
        log("Initialising Terraform...")
        try {
            spawnCommandSync('terraform', ['init']);
        }
        catch (e) {
            log("Error executing terraform init. Is terraform installed? ", e);
        }
    }
}