var editions = require('./choices/database-editions')
var sizes = require('./choices/database-sizes')
var az = require('../../common/az');
var config = require('../../common/config');

/**
 * Gets the default value from the Yeoman storage
 * @param {*} generator 
 * @param {*} key 
 * @param {*} defaultValue 
 */
function getConfig(generator, key, defaultValue) {
    return config.getDefault(generator, key, defaultValue);
}


module.exports = function (generator) {
    var questions = [];

    addDatabaseQuestions(questions, generator);
    addRestoreQuestions(questions, generator);

    return questions;
}

function addDatabaseQuestions(questions, generator) {
    questions.push({
        type: "input",
        name: "databaseName",
        message: "Database - Name",
        default: getConfig(generator, "databaseName", generator.appname) // Default to current folder name 
    });

    questions.push({
        type: "list",
        name: "databaseEdition",
        message: "Database - Edition",
        choices: editions,
        default: getConfig(generator, "databaseEdition", "Standard")
    });

    questions.push({
        type: "list",
        name: "databaseSize",
        message: "Database - Size",
        choices: (answers) => sizes[answers.databaseEdition],
        default: getConfig(generator, "databaseSize", "S0"),
        when: (answers) => (answers.databaseEdition === "Standard" || answers.databaseEdition === "Premium")
    });
}

function addRestoreQuestions(questions, generator) {
    questions.push({
        type: "confirm",
        name: "databaseRestore",
        message: "Database - Restore from existing database?",
        default: getConfig(generator, "databaseRestore")
    });

    questions.push({
        type: "list",
        name: "restoreResourceGroup",
        message: "Restore - Resource Group",
        choices: az.resourceGroups(generator),
        default: getConfig(generator, "restoreResourceGroup"),
        when: (answers) => answers.databaseRestore === true
    });

    questions.push({
        type: "list",
        name: "restoreServerId",
        message: "Restore - Server",
        choices: (answers) => az.sqlServers(generator, answers.restoreResourceGroup),
        default: getConfig(generator, "restoreServerId"),
        when: (answers) => answers.databaseRestore === true
    });

    questions.push({
        type: "list",
        name: "restoreDatabaseId",
        message: "Restore - Database",
        choices: (answers) => az.sqlDatabases(generator, answers.restoreServerId),
        default: getConfig(generator, "restoreDatabaseId"),
        when: (answers) => answers.databaseRestore === true
    });
}