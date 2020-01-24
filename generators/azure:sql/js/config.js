var terraform = require('../../../common/terraform');

module.exports = {
    copyServerConfig: function (fs, answers, configFile = 'terraform.tfvars.json') {
        terraform.writeConfig(fs, {
            RESOURCE_GROUP_NAME: answers.resourceGroup,
            SQL_LOCATIONS: answers.serverLocations,
            SQL_NAME_PREFIX: answers.name,
            SQL_VERSION: answers.serverVersion,
            SQL_ADMIN_LOGIN: answers.serverAdminLogin,
            SQL_ADMIN_PASSWORD: answers.serverAdminPassword
        }, configFile);
    },
    copyDatabaseConfig: function (fs, answers, configFile = 'terraform.tfvars.json') {
        terraform.writeConfig(fs, {
            DATABASE_NAME: answers.databaseName,
            DATABASE_EDITION: answers.databaseEdition,
            DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME: answers.databaseSize,
            DATABASE_CREATE_MODE: answers.databaseCreateMode,
            DATABASE_SOURCE_ID: answers.databaseSourceId
        }, configFile);
    }
}