var backends = require('./choices/backends');
var versions = require('./choices/versions');


module.exports = function (az, configManager) {
    var questions = [];
    questions.push({
        type: "input",
        name: "app",
        message: "Application - Name",
        default: configManager.getDefault("app", "cloudcommons")
    });

    questions.push({
        type: "list",
        name: "version",
        message: "Terraform - Version",
        choices: versions,
        default: configManager.getDefault("version")
    });

    questions.push({
        type: "list",
        name: "backendType",
        message: "Terraform - Back-end",
        choices: backends,
        default: configManager.getDefault("backendType")
    });    

    addRemoteQuestions(questions, configManager);
    addAzureQuestions(questions, az, configManager);

    return questions;
}

/**
 * Add questions related to the remote back-end
 * @param {*} questions 
 */
function addRemoteQuestions(questions, configManager) {
    questions.push({
        type: "input",
        name: "remoteHostname",
        message: "Terraform - Remote - Hostname",
        default: configManager.getDefault("remoteHostname", "app.terraform.io"),
        when: (answers) => answers.backendType === "remote"
    });

    questions.push({
        type: "input",
        name: "remoteOrganization",
        message: "Terraform - Remote - Organization",
        default: configManager.getDefault("remoteOrganization"),
        when: (answers) => answers.backendType === "remote"
    });

    questions.push({
        type: "input",
        name: "remoteWorkspacePrefix",
        message: "Terraform - Remote - Workspace prefix",
        default: (answers) => configManager.getDefault("remoteWorkspacePrefix", `${answers.app}-`),
        when: (answers) => answers.backendType === "remote"
    });

    questions.push({
        type: "password",
        name: "remoteToken",
        message: "Terraform - Remote - Token",
        default: configManager.getDefault("remoteToken"),
        when: (answers) => answers.backendType === "remote"
    });    

    questions.push({
        type: "confirm",
        name: "createRemoteVariables",
        message: "Terraform - Remote - Create variables after creating?",
        default: configManager.getDefault("createRemoteVariables"),
        when: (answers) => answers.backendType === "remote"
    });    
}

/**
 * Add questions related to the azurerm back-end
 * @param {*} questions 
 */
function addAzureQuestions(questions, az, configManager) {
    questions.push({
        type: "list",
        name: "azureRmResourceGroup",
        message: "Terraform - Azure - Resource Group",
        choices: az.resourceGroups(),
        default: configManager.getDefault("azureRmResourceGroup"),
        when: (answers) => answers.backendType === "azurerm"
    });

    questions.push({
        type: "list",
        name: "azureRmStorageAccountName",
        message: "Terraform - Azure - Storage Account",
        choices: (answers) => az.storageAccounts(answers.azureRmResourceGroup),
        default: configManager.getDefault("azureRmStorageAccountName"),
        when: (answers) => answers.backendType === "azurerm"
    });

    questions.push({
        type: "list",
        name: "azureRmContainerName",
        message: "Terraform - Azure - Container",
        choices: (answers) => az.storageContainers(answers.azureRmStorageAccountName),
        default: configManager.getDefault("azureRmContainerName"),
        when: (answers) => answers.backendType === "azurerm"
    });

    questions.push({
        type: "input",
        name: "azureRmContainerKey",
        message: "Terraform - Azure - Key",
        default: configManager.getDefault("azureRmContainerKey"),
        when: (answers) => answers.backendType === "azurerm"
    });
}