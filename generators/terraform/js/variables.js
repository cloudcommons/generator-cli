module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                APP: {
                    type: "string",
                    description: "(Required) Application to which the resources belongs to",
                    default: answers.app
                },
                ENVIRONMENT: {
                    type: "string",
                    description: "(Required) Environment name. Used in most cloudcommon names. Short names without special characters are encouraged.",
                    default : "default"
                },
                CREATOR: {
                    type: "string",
                    description: "(Required) Creator of the resources",
                    default: "cloudcommons"                   
                }
            }
        }

        terraform.writeVariables(variables, configFile);
    }
}