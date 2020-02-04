var az = require('../../common/az');
var config = require('../../common/config');
var terraform = require('../../common/terraform');
var resources = require('../../common/resources');
var replicationTypes = require('./choices/replicationTypes');
var storageKinds = require('./choices/storageKinds');
var storageAccountTiers = require('./choices/storageAccountTiers');
var storageAccessTiers = require('./choices/storageAccountTiers');

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
        message: "Storage - Account name",
        default: getConfig(generator, "name", `${terraform.generateKey(generator.appname)}-cluster`),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Storage - Resource Group",
        choices: resources.resourceGroups(generator),
        default: getConfig(generator, "resourceGroup")
    });

    questions.push({
        type: "list",
        name: "location",
        message: "Storage - Location",
        choices: az.locations(generator),
        default: getConfig(generator, "location")
    });

    questions.push({
        type: "list",
        name: "accountKind",
        message: "Storage - Kind",
        choices: storageKinds,
        default: getConfig(generator, "accountKind", "StorageV2")
    });

    questions.push({
        type: "list",
        name: "accountTier",
        message: "Storage - Account Tier",
        choices: (answers) => storageAccountTiers[answers.accountKind],
        default: getConfig(generator, "accountTier", "Standard")
    });

    questions.push({
        type: "list",
        name: "accessTier",
        message: "Storage - Access Tier",
        choices: storageAccessTiers,
        default: getConfig(generator, "accountTier", "Standard"),
        when: (answers) => (answers.accountTier === "FileStorage" || answers.accountTier === "StorageV2")
    });

    questions.push({
        type: "list",
        name: "accountReplicationType",
        message: "Storage - Replication type",
        choices: replicationTypes,
        default: getConfig(generator, "accountReplicationType", "LRS")
    });

    return questions;
}