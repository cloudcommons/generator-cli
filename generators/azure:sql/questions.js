var features = require('./choices/features');
var editions = require('./choices/database-editions')
var sizes = require('./choices/database-sizes')
var az = require('../../common/az');
var getConfig = require('../../common/getConfig')


module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "serverName",
        message: "Server - Name",
        default: getConfig(generator, "serverName", `${generator.appname}-sql`)
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Server - Resource Group",
        choices: az.resourceGroups(generator),
        default: getConfig(generator, "resourceGroup")
    });

    questions.push({
        type: "list",
        name: "serverLocation",
        message: "Server - Location",
        choices: az.locations(generator),
        default: getConfig(generator, "serverLocation")
    });

    questions.push({
        type: "input",
        name: "serverAdminLogin",
        message: "Server - Administrator user",
        default: getConfig(generator, "serverAdminLogin")
    });

    questions.push({
        type: "password",
        name: "serverAdminPassword",
        message: "Server - Administrator password",
        when: !getConfig(generator, "serverAdminLogin") // Terraform is not used to update admin credentials
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Server - Features",
        choices: features,
        default: getConfig(generator, "features", ["database"])
    });

    addDatabaseQuestions(questions, generator);
    addRestoreQuestions(questions, generator);
    addFailOverQuestions(questions, generator);

    return questions;
}

function addRestoreQuestions(questions, generator)
{
    questions.push({
        type: "confirm",
        name: "databaseRestore",
        message: "Database - Restore from existing database?",
        default: getConfig(generator, "databaseRestore"),
        when: (answers) => answers.features.includes("database")
    });

    questions.push({
        type: "list",
        name: "restoreResourceGroup",
        message: "Restore - Resource Group",
        choices: az.resourceGroups(generator),
        default: getConfig(generator, "restoreResourceGroup"),
        when: (answers) => answers.features.includes("database") && answers.databaseRestore === true
    });

    questions.push({
        type: "list",
        name: "restoreServerId",
        message: "Restore - Server",
        choices: (answers) => az.sqlServers(generator, answers.restoreResourceGroup),
        default: getConfig(generator, "restoreServerId"),
        when: (answers) => answers.features.includes("database") && answers.databaseRestore === true
    });

    questions.push({
        type: "list",
        name: "restoreDatabaseId",
        message: "Restore - Database",
        choices: (answers) => az.sqlDatabases(generator, answers.restoreServerId),
        default: getConfig(generator, "restoreDatabaseId"),
        when: (answers) => answers.features.includes("database") && answers.databaseRestore === true
    });       
}

function addDatabaseQuestions(questions, generator) {
    questions.push({
        type: "input",
        name: "databaseName",
        message: "Database - Name",
        default: getConfig(generator, "databaseName", generator.appname), // Default to current folder name        
        when: (answers) => answers.features.includes("database"),
    });

    questions.push({
        type: "list",
        name: "databaseEdition",
        message: "Database - Edition",
        choices: editions,
        default:  getConfig(generator, "databaseEdition", "Standard"),
        when: (answers) => answers.features.includes("database")
    });

    questions.push({
        type: "list",
        name: "databaseSize",
        message: "Database - Size",        
        choices: (answers) => sizes[answers.databaseEdition],
        default: getConfig(generator, "databaseSize", "S0"),
        when: (answers) => answers.features.includes("database") && (answers.databaseEdition === "Standard" || answers.databaseEdition === "Premium")
    });
}


function addFailOverQuestions(questions, generator) {
    questions.push({
        type: "checkbox",
        name: "failOverLocations",
        message: "Database - Fail over - Locations",
        choices: az.locations(generator),
        default: (answers) => getConfig(generator, "failOverLocations", [answers.serverLocation]),
        when: (answers) => answers.features.includes("database") && answers.features.includes("fail-over")
    });
}