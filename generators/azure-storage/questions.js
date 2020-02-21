var replicationTypes = require('./choices/replicationTypes');
var storageKinds = require('./choices/storageKinds');
var storageAccountTiers = require('./choices/storageAccountTiers');
var storageAccessTiers = require('./choices/storageAccessTiers');



module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Storage - Account name",
        default: configManager.getDefault("name", `${terraform.generateKey(generator.appname)}-cluster`),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Storage - Resource Group",
        choices: resources.resourceGroups(generator),
        default: configManager.getDefault("resourceGroup")
    });

    questions.push({
        type: "list",
        name: "location",
        message: "Storage - Location",
        choices: az.locations(),
        default: configManager.getDefault("location")
    });

    questions.push({
        type: "list",
        name: "accountKind",
        message: "Storage - Kind",
        choices: storageKinds,
        default: configManager.getDefault("accountKind", "StorageV2")
    });

    questions.push({
        type: "list",
        name: "accountTier",
        message: "Storage - Account Tier",
        choices: (answers) => storageAccountTiers[answers.accountKind],
        default: configManager.getDefault("accountTier", "Standard")
    });

    questions.push({
        type: "list",
        name: "accountAccessTier",
        message: "Storage - Access Tier",
        choices: storageAccessTiers,
        default: configManager.getDefault("accountAccessTier", "Hot"),
        when: (answers) => (answers.accountKind === "BLockblobStorage" || answers.accountKind === "FileStorage" || answers.accountKind === "StorageV2")
    });

    questions.push({
        type: "list",
        name: "accountReplicationType",
        message: "Storage - Replication type",
        choices: replicationTypes,
        default: configManager.getDefault("accountReplicationType", "LRS")
    });

    return questions;
}