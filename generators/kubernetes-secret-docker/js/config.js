module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {
        var config = {
            DOCKER_SECRET_NAME: answers.name,
            DOCKER_REPO_SERVER: answers.server,
            DOCKER_REPO_USERNAME: answers.username,
            DOCKER_REPO_PASSWORD: answers.password,
            DOCKER_REPO_EMAIL: answers.email
        };        

        if (!terraform.isDependency(answers.kNamespace)) {
            config.DOCKER_NAMESPACE = answers.kNamespace
        }

        terraform.writeConfig(config, configFile);
    }
}