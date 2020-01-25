var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            REDIS_NAME: answers.name,
            REDIS_LOCATION: answers.redisLocation,
            REDIS_RESOURCE_GROUP: answers.resourceGroup,
            REDIS_CAPACITY: answers.capacity,
            REDIS_FAMILY: answers.family,
            REDIS_SKU: answers.sku,
            REDIS_ENABLE_NON_SSL: !answers.features.sslOnly,
            REDIS_MINIMUM_TLS: answers.minimumTls,
            REDIS_SUBNET_ID: answers.vnetSubnet,
            REDIS_SUBNET_IP: answers.vnetStaticIp,
            REDIS_PATCH_SCHEDULE: null, // TODO
            REDIS_SHARD_COUNT: answers.shardCount
        }

        terraform.writeConfig(fs, config, configFile);
    }
}