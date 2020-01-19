var features = require('./choices/features');
var editions = require('./choices/database-editions')
var sizes = require('./choices/database-sizes')
var az = require('../../common/az');

module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "serverName",
        message: "Server - Name",
        default: generator.appname + "-sql" // Default to current folder name
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Server - Resource Group",
        choices: az.resourceGroups(generator)
    });

    questions.push({
        type: "list",
        name: "serverLocation",
        message: "Server - Location",
        choices: az.locations(generator),
    });

    questions.push({
        type: "input",
        name: "serverAdminLogin",
        message: "Server - Administrator user"
    });

    questions.push({
        type: "password",
        name: "serverAdminPassword",
        message: "Server - Administrator password"
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Server - Features",
        choices: features,
        default: ["database"]
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
        when: (answers) => answers.features.includes("database")
    });

    questions.push({
        type: "list",
        name: "restoreResourceGroup",
        message: "Restore - Resource Group",
        choices: az.resourceGroups(generator),
        when: (answers) => answers.features.includes("database") && answers.databaseRestore === true
    });

    questions.push({
        type: "list",
        name: "restoreServerId",
        message: "Restore - Server",
        choices: (answers) => az.sqlServers(generator, answers.restoreResourceGroup),
        when: (answers) => answers.features.includes("database") && answers.databaseRestore === true
    });

    questions.push({
        type: "list",
        name: "restoreDatabaseId",
        message: "Restore - Database",
        choices: (answers) => az.sqlDatabases(generator, answers.restoreServerId),
        when: (answers) => answers.features.includes("database") && answers.databaseRestore === true
    });       
}

function addDatabaseQuestions(questions, generator) {
    questions.push({
        type: "input",
        name: "databaseName",
        message: "Database - Name",
        default: generator.appname, // Default to current folder name        
        when: (answers) => answers.features.includes("database"),
    });

    questions.push({
        type: "list",
        name: "databaseEdition",
        message: "Database - Edition",
        choices: editions,
        default: "Standard",
        when: (answers) => answers.features.includes("database")
    });

    questions.push({
        type: "list",
        name: "databaseSize",
        message: "Database - Size",        
        choices: (answers) => sizes[answers.databaseEdition],
        default: "S0",
        when: (answers) => answers.features.includes("database") && (answers.databaseEdition === "Standard" || answers.databaseEdition === "Premium")
    });
}


function addFailOverQuestions(questions, generator) {
    questions.push({
        type: "checkbox",
        name: "failOverLocations",
        message: "Database - Fail over - Locations",
        choices: az.locations(generator),
        default: (answers) => [answers.serverLocation],
        when: (answers) => answers.features.includes("database") && answers.features.includes("fail-over")
    });
}