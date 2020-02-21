var editions = require('./choices/database-editions')
var sizes = require('./choices/database-sizes')

module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];
    questions = addDatabaseQuestions(questions, generator, terraform, configManager, resources);
    questions = addRestoreQuestions(questions, az, configManager);
    return questions;
}

function addDatabaseQuestions(questions, generator, terraform, configManager, resources) {    
    questions.push({
        type: "input",
        name: "databaseName",
        message: "Database - Name",
        default: configManager.getDefault("databaseName", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey,
        when: !generator.options.databaseName
    });

    questions.push({
        type: "list",
        name: "databaseServerResourceGroup",
        message: "Database - Server - Resource Group",
        choices: resources.resourceGroups(),
        default: configManager.getDefault("databaseServerResourceGroup"),
        when: !generator.options.databaseServer
    });

    questions.push({
        type: "list",
        name: "databaseServer",
        message: "Database - Server - Name",
        choices: (answers) => resources.sqlServers(answers.databaseServerResourceGroup),
        default: configManager.getDefault("databaseServer"),
        when: (answers) => !generator.options.databaseServer
    });

    questions.push({
        type: "list",
        name: "databaseEdition",
        message: "Database - Edition",
        choices: editions,
        default: configManager.getDefault("databaseEdition", "Standard")
    });

    questions.push({
        type: "list",
        name: "databaseSize",
        message: "Database - Size",
        choices: (answers) => sizes[answers.databaseEdition],
        default: configManager.getDefault("databaseSize", "S0"),
        when: (answers) => (answers.databaseEdition === "Standard" || answers.databaseEdition === "Premium")
    });

    return questions;
}

function addRestoreQuestions(questions, az, configManager) {
    questions.push({
        type: "confirm",
        name: "databaseRestore",
        message: "Database - Restore from existing database?",
        default: configManager.getDefault("databaseRestore", false)
    });

    questions.push({
        type: "list",
        name: "restoreResourceGroup",
        message: "Restore - Resource Group",
        choices: az.resourceGroups(),
        default: configManager.getDefault("restoreResourceGroup"),
        when: (answers) => answers.databaseRestore === true
    });

    questions.push({
        type: "list",
        name: "restoreServerId",
        message: "Restore - Server",
        choices: (answers) => az.sqlServers(answers.restoreResourceGroup),
        default: configManager.getDefault("restoreServerId"),
        when: (answers) => answers.databaseRestore === true
    });

    questions.push({
        type: "list",
        name: "restoreDatabaseId",
        message: "Restore - Database",
        choices: (answers) => az.sqlDatabases(answers.restoreServerId),
        default: configManager.getDefault("restoreDatabaseId"),
        when: (answers) => answers.databaseRestore === true
    });

    return questions;
}