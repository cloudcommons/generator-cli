module.exports = {
    /**
     * Writes an object into terraform.tfvars.json. If the file exists, the properies from both objects (existing and given) 
     * are merged and written
     * @param {*} generator 
     * @param {*} terraformConfig 
     */
    writeConfig: function(generator, terraformConfig, configFile = 'terraform.tfvars.json') {
        var existing = generator.fs.readJSON(configFile, {});
        var target = Object.assign({}, existing, terraformConfig);
        generator.fs.writeJSON(configFile, target);
    }
}