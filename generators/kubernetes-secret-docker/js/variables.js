module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                DOCKER_SECRET_NAME: {
                    type: "string",
                    description: ("(Required) The name of docker secret")
                },
                DOCKER_REPO_SERVER: {
                    type: "string",
                    description: ("(Required) Private Docker repository server")
                },
                DOCKER_REPO_USERNAME: {
                    type: "string",
                    description: ("(Required) Private Docker repository username")
                },
                DOCKER_REPO_PASSWORD: {
                    type: "string",
                    description: ("(Required) Private Docker repository password")
                },
                DOCKER_REPO_EMAIL: {
                    type: "string",
                    description: ("(Required) Private Docker repository email")
                }                
            }
        }

        if (!terraform.isDependency(answers.kNamespace)) {
            variables.variable.DOCKER_NAMESPACE = {
                type: "string",
                description: ("(Required) Namespace to create this secret on")                
            }
        }

        terraform.writeVariables(variables);
    }
}