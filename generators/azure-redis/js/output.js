module.exports = {
    copy: function (terraform, answers) {

        var outputBase = `azurerm_redis_cache.${answers.name}`;
        var output = {
            output: {
                REDIS_ID: {
                    description: "Azure Redis Service ID",
                    value: terraform.toVariable(`${outputBase}.id`)
                },
                REDIS_HOSTNAME: {
                    description: "The Hostname of the Redis Instance",
                    value: terraform.toVariable(`${outputBase}.hostname`)
                },
                REDIS_SSL_PORT: {
                    description: "The SSL Port of the Redis Instance",
                    value: terraform.toVariable(`${outputBase}.ssl_port`)
                },
                REDIS_PORT: {
                    description: "The non-SSL Port of the Redis Instance",
                    value: terraform.toVariable(`${outputBase}.port`)
                },                
                REDIS_PRIMARY_KEY: {
                    description: "The Primary Access Key for the Redis Instance",
                    value: terraform.toVariable(`${outputBase}.primary_access_key`),
                    sensitive: true
                },
                REDIS_SECONDARY_KEY: {
                    description: "The Secondary Access Key for the Redis Instance",
                    value: terraform.toVariable(`${outputBase}.secondary_access_key`),
                    sensitive: true
                },
                REDIS_CONFIGURATION: {
                    description: "A redis_configuration block",
                    value: terraform.toVariable(`${outputBase}.redis_configuation`),
                }
            }
        }

        terraform.writeOutput(output);
    }
}

