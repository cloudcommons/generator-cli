var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {

        var config = {
            SEARCH_NAME: answers.name,
            SEARCH_LOCATION: answers.location,
            SEARCH_RESOURCE_GROUP: answers.resourceGroup,
            SEARCH_SKU: answers.sku,
            SEARCH_REPLICA_COUNT: answers.replicaCount,
            SEARCH_PARTITION_COUNT: answers.partitionCount
        }

        terraform.writeConfig(fs, config);
    }
}