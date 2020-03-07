module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            LOCATION: answers.location,
            LOG_ANALYTICS_RETENTION_DAYS: answers.retention
        };

        if (!terraform.isDependency(answers.resourceGroup)) {
            config.RESOURCE_GROUP_NAME = terraform.resolveConfigDependency(answers.resourceGroup)
        }

        terraform.writeConfig(config, configFile);
    }
}