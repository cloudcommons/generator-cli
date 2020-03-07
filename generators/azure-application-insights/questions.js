const types = require('./choices/types');

module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Application Insights - Name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey,
        when: !generator.options["name"]
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Application Insights - Resource Group",
        choices: resources.resourceGroups(),
        default: configManager.getDefault("resourceGroup"),
        when: !generator.options["resourceGroup"]        
    });    

    questions.push({
        type: "list",
        name: "location",
        message: "Application Insights - Location",
        choices: az.locations(),
        default: configManager.getDefault("location"),
        when: !generator.options["location"]
    });

    questions.push({
        type: "list",
        name: "type",
        message: "Application Insights - Type",
        choices: types,
        default: configManager.getDefault("type"),
        when: !generator.options["type"]
    });    

    return questions;
}