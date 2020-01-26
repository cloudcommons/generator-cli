var backends = require('./choices/backends');
var versions = require('./choices/versions');
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

    questions.push({
        type: "list",
        name: "version",
        message: "Terraform - Version",
        choices: versions,
        default: getConfig(generator, "version")
    });

    questions.push({
        type: "list",
        name: "backendType",
        message: "Terraform - Back-end",
        choices: backends,
        default: getConfig(generator, "backendType")
    });

    addRemoteQuestions(generator, questions);
    addAzureQuestions(generator, questions);

    return questions;
}

/**
 * Add questions related to the remote back-end
 * @param {*} questions 
 */
function addRemoteQuestions(generator, questions) {
    questions.push({
        type: "input",
        name: "remoteHostname",
        message: "Terraform - Remote - Hostname",
        default: getConfig(generator, "remoteHostname", "app.terraform.io"),
        when: (answers) => answers.backendType === "remote"
    });

    questions.push({
        type: "input",
        name: "remoteOrganization",
        message: "Terraform - Remote - Organization",
        default: getConfig(generator, "remoteOrganization"),
        when: (answers) => answers.backendType === "remote"
    });

    questions.push({
        type: "input",
        name: "remoteWorkspace",
        message: "Terraform - Remote - Workspace",
        default: getConfig(generator, "remoteWorkspace"),
        when: (answers) => answers.backendType === "remote"
    });
}

/**
 * Add questions related to the azurerm back-end
 * @param {*} questions 
 */
function addAzureQuestions(generator, questions) {
    questions.push({
        type: "list",
        name: "azureRmResourceGroup",
        message: "Terraform - Azure - Resource Group",
        choices: az.resourceGroups(generator),
        default: getConfig(generator, "azureRmResourceGroup"),
        when: (answers) => answers.backendType === "azurerm"
    });

    questions.push({
        type: "list",
        name: "azureRmStorageAccountName",
        message: "Terraform - Azure - Storage Account",
        choices: (answers) => az.storageAccounts(generator, answers.azureRmResourceGroup),
        default: getConfig(generator, "azureRmStorageAccountName"),
        when: (answers) => answers.backendType === "azurerm"
    });

    questions.push({
        type: "list",
        name: "azureRmContainerName",
        message: "Terraform - Azure - Container",
        choices: (answers) => az.storageContainers(generator, answers.azureRmStorageAccountName),
        default: getConfig(generator, "azureRmContainerName"),
        when: (answers) => answers.backendType === "azurerm"
    });

    questions.push({
        type: "input",
        name: "azureRmContainerKey",
        message: "Terraform - Azure - Key",
        default: getConfig(generator, "azureRmContainerKey"),
        when: (answers) => answers.backendType === "azurerm"
    });
}