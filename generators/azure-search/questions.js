var az = require('../../common/az');
var config = require('../../common/config')
var skus = require('./choices/skus');
var terraform = require('../../common/terraform');
var resources = require('../../common/resources');

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
        name: "name",
        message: "Azure Cognitive Search - Name",
        default: getConfig(generator, "name", `${terraform.generateKey(generator.appname)}-search`),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Azure Cognitive Search - Resource Group",
        choices: resources.resourceGroups(generator),
        default: getConfig(generator, "resourceGroup")
    });

    questions.push({
        type: "list",
        name: "location",
        message: "Azure Cognitive Search - Location",
        choices: az.locations(generator),
        default: getConfig(generator, "location"),
        when: (answers) => !terraform.isDependency(answers.resourceGroup)
    });

    questions.push({
        type: "list",
        name: "sku",
        message: "Azure Cognitive Search - SKU",
        choices: skus,
        default: getConfig(generator, "sku", "basic")
    });

    questions.push({
        type: "list",
        name: "partitionCount",
        message: "Azure Cognitive Search - Partition count",
        choices: [1, 2, 3, 4, 6, 12],
        default: getConfig(generator, "partitionCount", 1),
        when: (answers) => answers.sku === "standard"
    });

    questions.push({
        type: "list",
        name: "replicaCount",
        message: "Azure Cognitive Search - Replica count",
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        default: getConfig(generator, "replicaCount", 1),
        when: (answers) => answers.sku === "standard"
    });

    return questions;
}