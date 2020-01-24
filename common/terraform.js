module.exports = {
    /**
     * Writes an object into terraform.tfvars.json. If the file exists, the properies from both objects (existing and given) 
     * are merged and written
     * @param {*} fs 
     * @param {*} terraformConfig 
     * @param {*} configFile
     */
    writeConfig: function (fs, terraformConfig, configFile = 'terraform.tfvars.json') {
        var existing = fs.readJSON(configFile, {});
        var target = Object.assign({}, existing, terraformConfig);
        fs.writeJSON(configFile, target);
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