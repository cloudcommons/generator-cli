var features = require('./choices/features');


module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Server - Name",
        default: configManager.getDefault("name", `${terraform.generateKey(generator.appname)}-sql`),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Server - Resource Group",
        choices: resources.resourceGroups(),
        default: configManager.getDefault("resourceGroup")
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Server - Features",
        choices: features,
        default: configManager.getDefault("features", ["database"])
    });

    questions.push({
        type: "list",
        name: "serverLocation",
        message: "Server - Location",
        choices: az.locations(),
        default: configManager.getDefault("serverLocation"),
        when: (answers) => !answers.features.includes("fail-over")
    });

    questions.push({
        type: "checkbox",
        name: "serverLocations",
        message: "Server - Locations (Choose only 2 please)",
        choices: az.locations(),
        default: (answers) => configManager.getDefault("serverLocations", [answers.serverLocation]),
        when: (answers) => answers.features.includes("fail-over")
    });

    questions.push({
        type: "input",
        name: "serverAdminLogin",
        message: "Server - Administrator user",
        default: configManager.getDefault("serverAdminLogin")
    });

    questions.push({
        type: "password",
        name: "serverAdminPassword",
        message: "Server - Administrator password",
    });

    questions.push({
        type: "input",
        name: "databaseName",
        message: "Database - Name",
        default: configManager.getDefault("databaseName", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey,
        when: (answers) => answers.features.includes("database")
    });    

    return questions;

}