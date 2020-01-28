var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            RESOURCE_GROUP_NAME: answers.resourceGroup,
            SQL_LOCATIONS: answers.serverLocations,
            SQL_NAME_PREFIX: answers.name,
            SQL_VERSION: answers.serverVersion,
            SQL_ADMIN_LOGIN: answers.serverAdminLogin,
            SQL_ADMIN_PASSWORD: answers.serverAdminPassword
        }

        terraform.writeConfig(fs, config, configFile);
    }
}