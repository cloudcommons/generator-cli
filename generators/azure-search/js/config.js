var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {

        var config = {
            SEARCH_NAME: answers.name,
            SEARCH_SKU: answers.sku,
            SEARCH_REPLICA_COUNT: answers.replicaCount,
            SEARCH_PARTITION_COUNT: answers.partitionCount
        }

        if (!terraform.isDependency(answers.resourceGroupReference)) {
            Object.assign({
                SEARCH_LOCATION: answers.location,
                SEARCH_RESOURCE_GROUP: answers.resourceGroup,
            }, config);
        }

        terraform.writeConfig(fs, config);
    }
}