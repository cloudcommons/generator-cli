module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                APP: {
                    type: "string",
                    description: "Application to which the resources belongs to",
                    default: answers.app
                },
                CREATOR: {
                    type: "string",
                    description: "Creator of the resources",
                    default: "cloudcommons"                   
                }
            }
        }

        terraform.writeVariables(variables, configFile);
    }
}