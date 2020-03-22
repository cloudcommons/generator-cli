module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "DNS Zone - Name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey,
        when: !generator.options["name"]
    });

    questions.push({
        type: "input",
        name: "tld",
        message: "DNS Zone - TLD",
        default: configManager.getDefault("tld", "my-app.io"),
        when: !generator.options["tld"]
    });    

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "DNS Zone - Resource Group",
        choices: resources.resourceGroups(),
        default: configManager.getDefault("resourceGroup"),
        when: !generator.options["resourceGroup"]        
    });    

    return questions;
}