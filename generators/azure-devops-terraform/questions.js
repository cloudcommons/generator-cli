var config = require('../../common/config');
var terraform = require('../../common/terraform');

module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Project name",
        default: config.getDefault(generator, "name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey
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