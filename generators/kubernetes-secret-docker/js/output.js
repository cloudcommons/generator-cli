module.exports = {
    copy: function (terraform, answers) {
        var output = {
            output: {
                DOCKER_SECRET_NAME: {
                    description: "Docker secret name",
                    value: terraform.toVariable(`kubernetes_secret.${answers.name}.metadata.0.name`)
                },
                DOCKER_REPO_SERVER: {
                    description: "Docker repository server",
                    value: terraform.toVariable(`var.DOCKER_REPO_SERVER`)
                }
            }
        }

        terraform.writeOutput(output);
    }
}                                