var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                REDIS_NAME: {
                    type: "string",
                    description: ("(Required) The name of the Redis instance. Changing this forces a new resource to be created.")
                },
                REDIS_LOCATION: {
                    type: "string",
                    description: " (Required) The location of the resource group."
                },
                REDIS_RESOURCE_GROUP: {
                    type: "string",
                    description: ("(Required) The name of the resource group in which to create the Redis instance.")
                },
                REDIS_CAPACITY: {
                    type: "string",
                    description: "(Required) The size of the Redis cache to deploy. Valid values for a SKU family of C (Basic/Standard) are 0, 1, 2, 3, 4, 5, 6, and for P (Premium) family are 1, 2, 3, 4."
                },
                REDIS_FAMILY: {
                    type: "string",
                    description: "(Required) The SKU family/pricing group to use. Valid values are C (for Basic/Standard SKU family) and P (for Premium)"
                },
                REDIS_SKU: {
                    type: "string",
                    description: "(Required) The SKU of Redis to use. Possible values are Basic, Standard and Premium."
                },
                REDIS_ENABLE_NON_SSL: {
                    type: "bool",
                    description: "(Optional) Enable the non-SSL port (6379) - disabled by default.",
                    default: false
                },
                REDIS_MINIMUM_TLS: {
                    type: "string",
                    description: "(Optional) The minimum TLS version. Defaults to 1.0.",
                    default: "1.0"
                },
                REDIS_SUBNET_ID: {
                    type: "string",
                    description: "(Optional) Only available when using the Premium SKU The ID of the Subnet within which the Redis Cache should be deployed. This Subnet must only contain Azure Cache for Redis instances without any other type of resources. Changing this forces a new resource to be created.",
                    default: null
                },
                REDIS_SUBNET_IP: {
                    type: "string",
                    description: "(Optional) The Static IP Address to assign to the Redis Cache when hosted inside the Virtual Network. Changing this forces a new resource to be created.",
                    default: null
                },
                REDIS_PATCH_SCHEDULE: {
                    type: "list(object({day_of_week=string, start_hour_utc=number}))",
                    description: "(Optional) A list of week days and hour to start a server patch - only available for Premium SKU's. Note: The Patch Window lasts for 5 hours from the start_hour_utc.",
                    default: []
                },
                REDIS_SHARD_COUNT: {
                    type: "number",
                    description: "(Optional) Only available when using the Premium SKU The number of Shards to create on the Redis Cluster.",
                    default: null
                }
            }
        }

        terraform.writeVariables(fs, variables, configFile);
    }
}