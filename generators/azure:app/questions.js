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
        choices: ["Install nginx-ingress", "Enable TLS", "Private Docker Registry", "Generate Azure DNS record"],
        default: ["Install nginx-ingress", "Enable TLS"]

    });

    return questions;
}