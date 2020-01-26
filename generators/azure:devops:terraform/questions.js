var config = require('../../common/config');

module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Project name",
        default: config.getDefault(generator, "name", generator.appname)// Default to current folder name
    });

    questions.push({
        type: "input",
        name: "subscription",
        message: "Azurerm - Subscription (Should meet an existing Service Connection to Azurerm in Azure DevOps)",
        default: config.getDefault(generator, "subscription")
    });

    questions.push({
        type: "input",
        name: "terraformRoot",
        message: "Terraform - Root folder",
        default: config.getDefault(generator, "terraformRoot", "/")
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Application features",
        choices: ["templates", "pipelines"],
        default: config.getDefault(generator, "features", ["templates", "pipelines"])
    });

    return questions;
}