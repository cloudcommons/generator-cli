var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            REDIS_NAME: answers.name,
            REDIS_CAPACITY: answers.capacity,
            REDIS_FAMILY: answers.family,
            REDIS_SKU: answers.sku,
            REDIS_ENABLE_NON_SSL: answers.features.nonSsl,
            REDIS_MINIMUM_TLS: answers.minimumTls,
            REDIS_SUBNET_ID: answers.vnetSubnet,
            REDIS_SUBNET_IP: answers.vnetStaticIp,
            REDIS_PATCH_SCHEDULE: answers.patchScheduleDays ? answers.patchScheduleDays.map(function (day) { return { day_of_week: day, start_hour_utc: answers.patchScheduleTime } }) : null,
            REDIS_SHARD_COUNT: answers.shardCount
        }

        if (!terraform.isDependency(answers.resourceGroup)) {
            config = Object.assign({
                REDIS_LOCATION: answers.location,
                REDIS_RESOURCE_GROUP: answers.resourceGroup,
            }, config);
        }

        terraform.writeConfig(fs, config, configFile);
    }
}