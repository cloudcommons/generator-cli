var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {
        terraform.writeConfig(fs, {
            RESOURCE_GROUP_NAME: answers.name,
            LOCATION: answers.location,
        }, configFile);
    }
}