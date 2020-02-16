module.exports = function (generator, az, terraform, configManager) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Docker secret - Name",
        validate: terraform.validateKey,
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),        
        when: !generator.options["name"]
    });

    questions.push({
        type: "input",
        name: "kNamespace",
        message: "Docker - Namespace",
        default: configManager.getDefault("kNamespace"),
        when: !generator.options["kNamespace"]
    });    

    questions.push({
        type: "input",
        name: "server",
        message: "Docker - Server",
        default: configManager.getDefault("server"),
        when: !generator.options["server"]
    });

    questions.push({
        type: "input",
        name: "email",
        message: "Docker - Email",
        default: configManager.getDefault("email"),
        when: !generator.options["email"]
    });

    questions.push({
        type: "input",
        name: "username",
        message: "Docker - Username",
        default: configManager.getDefault("username"),
        when: !generator.options["username"]
    });

    questions.push({
        type: "password",
        name: "password",
        message: "Docker - Password",
        when: !generator.options["password"]
    });   

    return questions;
}