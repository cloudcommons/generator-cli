module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {
        terraform.writeConfig({
            IP_RESOURCE_GROUP_NAME: terraform.resolveConfigDependency(answers.resourceGroup),
            IP_LOCATION: answers.location,
            IP_VERSION: answers.ipVersion,
            IP_ALLOCATION_METHOD: answers.ipAllocationMethod
        }, configFile);
    }
}