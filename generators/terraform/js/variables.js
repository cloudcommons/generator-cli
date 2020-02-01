var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                APP: {
                    type: "string",
                    description: "Application to which the resources belongs to",
                    default: answers.app
                }
            }
        }

        terraform.writeVariables(fs, variables);
    }
}