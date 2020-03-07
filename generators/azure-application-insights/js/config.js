module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            LOCATION: answers.location,
            APP_INSIGHTS_TYPE: answers.type
        };

        if (!terraform.isDependency(answers.resourceGroup)) {
            config.RESOURCE_GROUP_NAME = terraform.resolveConfigDependency(answers.resourceGroup)
        }

        terraform.writeConfig(config, configFile);
    }
}