const helpers = require('yeoman-test');
const path = require('path');
const basePath = path.join(__dirname, '../../generators');

const paths = {    
    terraform: path.join(basePath, 'terraform'),
    resourceGroup: path.join(basePath, 'azure-resource-group'),
    logAnalytics: path.join(basePath, 'azure-log-analytics')
}

module.exports = {
    /**
     * Executes a resource group generator
     * @param {*} dir 
     * @param {*} name 
     * @param {*} location 
     */
    resourceGroup: function (dir, name, location = 'westeu') {
        var prompts = {
            name: name,
            location: location
        };

        return this.generator(paths.resourceGroup, prompts, dir);
    },
    terraform: function (dir, app, version = "0.12.20", backendType = "local") {
        var prompts = {
            app: app,
            version: version,
            backendType: backendType
        };

        return this.generator(paths.terraform, prompts, dir);
    },
    logAnalytics: function(dir, name, resourceGroup, location) {
        var prompts = {
            name: name,
            resourceGroup: resourceGroup,
            location: location,
            retentionDays: 30
        };

        return this.generator(paths.logAnalytics, prompts, dir);
    },
    generator: async function executeGenerator(generator, prompts, dir) {
        var promise = new Promise(done => {
            helpers
                .run(generator)
                .cd(dir)
                .withPrompts(prompts)
                .once('end', done)
        });

        return promise;
    }
}
