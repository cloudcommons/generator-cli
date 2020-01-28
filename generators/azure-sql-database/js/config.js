var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {
        terraform.writeConfig(fs, {
            DATABASE_NAME: answers.databaseName,
            DATABASE_EDITION: answers.databaseEdition,
            DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME: answers.databaseSize,
            DATABASE_CREATE_MODE: answers.databaseCreateMode,
            DATABASE_SOURCE_ID: answers.restoreDatabaseId
        }, configFile);
    }
}