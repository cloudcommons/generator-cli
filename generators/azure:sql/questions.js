var features = require('./choices/features');
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

    return questions;

}