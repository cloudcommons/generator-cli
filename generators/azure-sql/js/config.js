module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {

        var config = {            
            SQL_LOCATIONS: answers.serverLocations,
            SQL_NAME_PREFIX: answers.name,
            SQL_VERSION: answers.serverVersion,
            SQL_ADMIN_LOGIN: answers.serverAdminLogin,
            SQL_ADMIN_PASSWORD: answers.serverAdminPassword
        }

        if (!terraform.isDependency(answers.resourceGroup)) {
            config.RESOURCE_GROUP_NAME = answers.resourceGroup;
        }        

        terraform.writeConfig(config, configFile);
    }
}