module.exports = function (generator, az, terraform, configManager) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Workspace - Name",
        validate: terraform.validateKey,
        when: !generator.options.name
    });

    questions.push({
        type: "password",
        name: "token",
        message: "Terraform Cloud - Token",
        when: (generator.provider && generator.provider.remote && !generator.provider.remote.token) && (!generator.options.token)
    });

    return questions;
}