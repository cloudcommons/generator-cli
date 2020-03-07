module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Log Analytics - Name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey,
        when: !generator.options["name"]
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Log Analytics - Resource Group",
        choices: resources.resourceGroups(),
        default: configManager.getDefault("resourceGroup"),
        when: !generator.options["resourceGroup"]        
    });    

    questions.push({
        type: "list",
        name: "location",
        message: "Log Analytics - Location",
        choices: az.locations(),
        default: configManager.getDefault("location"),
        when: !generator.options["location"]
    });

    questions.push({
        type: "input",
        name: "retention",
        message: "Log Analytics - Retention (In days. Between 30 and 730 days)",    
        default: configManager.getDefault("retention", 30),
        when: !generator.options["retention"]
    });    

    return questions;
}