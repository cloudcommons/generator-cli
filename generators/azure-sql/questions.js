var features = require('./choices/features');
var resources = require('../../common/resources');
var az = require('../../common/az');
var config = require('../../common/config');
var terraform = require('../../common/terraform');

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

    questions.push({
        type: "input",
        name: "serverName",
        message: "Server - Name",
        default: getConfig(generator, "serverName", `${terraform.generateKey(generator.appname)}-sql`),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Server - Resource Group",
        choices: resources.resourceGroups(generator),
        default: getConfig(generator, "resourceGroup")
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Server - Features",
        choices: features,
        default: getConfig(generator, "features", ["database"])
    });

    questions.push({
        type: "list",
        name: "serverLocation",
        message: "Server - Location",
        choices: az.locations(generator),
        default: getConfig(generator, "serverLocation"),
        when: (answers) => !answers.features.includes("fail-over")
    });

    questions.push({
        type: "checkbox",
        name: "serverLocations",
        message: "Server - Locations (Choose only 2 please)",
        choices: az.locations(generator),
        default: (answers) => getConfig(generator, "serverLocations", [answers.serverLocation]),
        when: (answers) => answers.features.includes("fail-over")
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
    });

    questions.push({
        type: "input",
        name: "databaseName",
        message: "Database - Name",
        default: getConfig(generator, "databaseName", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey,
        when: (answers) => answers.features.includes("database")
    });    

    return questions;

}