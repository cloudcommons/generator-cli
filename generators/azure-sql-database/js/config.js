module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            DATABASE_NAME: answers.name,
            DATABASE_EDITION: answers.databaseEdition,
            DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME: answers.databaseSize,
            DATABASE_CREATE_MODE: answers.databaseCreateMode,
            DATABASE_SOURCE_ID: answers.restoreDatabaseId
        };

        if (!terraform.isDependency(answers.databaseServer)) {
            config.DATABASE_SERVER = answers.databaseServer;
            config.DATABASE_SERVER_RESOURCE_GROUP = answers.databaseServerResourceGroup;
        }

        terraform.writeConfig(config, configFile);
    }
}