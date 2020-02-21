module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {
        terraform.writeConfig({
            RESOURCE_GROUP_NAME: answers.name,
            LOCATION: answers.location,
        }, configFile);
    }
}