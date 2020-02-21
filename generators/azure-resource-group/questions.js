module.exports = function (generator, az, terraform, configManager) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Resource group - Name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "location",
        message: "Resource group - Location",
        choices: az.locations(),
        default: configManager.getDefault("location")
    });

    return questions;
}