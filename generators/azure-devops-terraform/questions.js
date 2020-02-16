module.exports = function (generator, terraform, configManager) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Project name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey
    });

    questions.push({
        type: "input",
        name: "subscription",
        message: "Azurerm - Subscription (Should meet an existing Service Connection to Azurerm in Azure DevOps)",
        default: configManager.getDefault("subscription")
    });

    questions.push({
        type: "input",
        name: "terraformRoot",
        message: "Terraform - Root folder",
        default: configManager.getDefault("terraformRoot", "/")
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Application features",
        choices: ["templates", "pipelines"],
        default: configManager.getDefault("features", ["templates", "pipelines"])
    });

    return questions;
}