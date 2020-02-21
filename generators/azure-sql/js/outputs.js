var merge = require('../../../core/merge');

module.exports = {
    copy: function (terraform, answers) {

        var server = `azurerm_sql_server.${answers.name}.*`;
        var output = {
            output: {
                SQL_SERVER_IDS: {
                    description: "SQL Server Ids",
                    value: terraform.toVariable(`${server}.id`)
                },
                SQL_SERVER_FQDNS: {
                    description: "SQL Server Fully Qualified Domain names",
                    value: terraform.toVariable(`${server}.fully_qualified_domain_name`)
                },
                SQL_SERVER_IDENTITIES: {
                    description: "SQL Server Identities",
                    value: terraform.toVariable(`${server}.identity`)
                }
            },         
        }

        if (answers.failOver) {
            var failoverName = `azurerm_sql_failover_group.${answers.name}`
            var failover = {
                SQL_FAILOVER_ID: {
                    description: "SQL Server failover group id",
                    value: terraform.toVariable(`${failoverName}.id`)
                },
                SQL_FAILOVER_LOCATION: {
                    description: "SQL Server failover location",
                    value: terraform.toVariable(`${failoverName}.location`)
                },
                SQL_FAILOVER_SERVER_NAME: {
                    description: "SQL Server primary server name",
                    value: terraform.toVariable(`${failoverName}.server_name`)
                },
                SQL_FAILOVER_ROLE: {
                    description: "SQL Server local replication role of the failover group instance",
                    value: terraform.toVariable(`${failoverName}.role`)
                },
                SQL_FAILOVER_DATABASES: {
                    description: "List of SQL Server databases in the failover group",
                    value: terraform.toVariable(`${failoverName}.databases`)
                },
                SQL_FAILOVER_PARTNER_SERVERS: {
                    description: "List of partner SQL Server information for the failover group",
                    value: terraform.toVariable(`${failoverName}.partner_servers`)
                }
            };
            
            output = merge(output, failover);            
        }

        terraform.writeOutput(output);
    }
}

