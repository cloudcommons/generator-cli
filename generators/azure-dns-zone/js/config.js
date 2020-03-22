module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            DNS_ZONE_NAME: answers.tld
        };

        if (!terraform.isDependency(answers.resourceGroup)) {
            config.RESOURCE_GROUP_NAME = terraform.resolveConfigDependency(answers.resourceGroup)
        }

        terraform.writeConfig(config, configFile);
    }
}