module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Project name",
        default: generator.appname // Default to current folder name
    });

    questions.push({
        type: "input",
        name: "subscription",
        message: "Azurerm - Subscription (Should meet an existing Service Connection to Azurerm in Azure DevOps)"
    });

    questions.push({
        type: "input",
        name: "terraformRoot",
        message: "Terraform - Root folder",
        default: "/"
    });        

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Application features",
        choices: ["templates", "pipelines"],
        default: ["templates", "pipelines"]
    });

    return questions;
}