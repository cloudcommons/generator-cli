var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {
        var config = {
            STORAGE_NAME: answers.name,
            STORAGE_ACCOUNT_KIND: answers.accountKind,
            STORAGE_ACCOUNT_TIER: answers.accountTier,
            STORAGE_REPLICATION_TYPE: answers.accountReplicationType,
            STORAGE_ACCESS_TIER: answers.accessTier,
            LOCATION: answers.location,
        };

        if (!terraform.isDependency(answers.resourceGroup)) {
            config.RESOURCE_GROUP_NAME = answers.resourceGroup;
        }

        terraform.writeConfig(fs, config, configFile);
    }
}