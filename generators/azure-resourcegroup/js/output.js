var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        var output = {
            output: {
                RESOURCE_GROUP_ID: {
                    description: "The resource group ID",
                    value: terraform.toVariable(`azurerm_resource_group.${answers.name}.id`)
                }
            }
        }

        terraform.writeOutput(fs, output);
    }
}                                