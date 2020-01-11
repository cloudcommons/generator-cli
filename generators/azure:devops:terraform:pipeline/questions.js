module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Project name",
        default: generator.appname // Default to current folder name
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Application features",
        choices: ["template", "pipeline"],
        default: ["template", "pipeline"]
    });

    return questions;
}