module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {        
        var config = {
            STORAGE_NAME: answers.name,
            STORAGE_ACCOUNT_KIND: answers.accountKind,
            STORAGE_ACCOUNT_TIER: answers.accountTier,
            STORAGE_REPLICATION_TYPE: answers.accountReplicationType,
            STORAGE_ACCESS_TIER: answers.accountAccessTier            
        };

        if (!terraform.isDependency(answers.resourceGroup)) {
            config.RESOURCE_GROUP_NAME = answers.resourceGroup;
            config.LOCATION = answers.location;
        }
        
        terraform.writeConfig(config, configFile);
    }
}