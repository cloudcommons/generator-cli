var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'variables.tf.json') {
        var variables = {
            variable: {
                DATABASE_NAME: {
                    type: "string",
                    description: "(Required) Database name",
                },
                DATABASE_EDITION: {
                    type: "string",
                    description: ("(Optional) The edition of the database to be created. Applies only if create_mode is Default. Valid values are: Basic, Standard, Premium, DataWarehouse, Business, BusinessCritical, Free, GeneralPurpose, Hyperscale, Premium, PremiumRS, Standard, Stretch, System, System2, or Web. Please see Azure SQL Database Service Tiers."),
                    default: "Basic"
                },
                DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME: {
                    type: "string",
                    description: ("(Optional) Not the best intuitive name, but... blame Microsoft. Use requested_service_objective_name or requested_service_objective_id to set the performance level for the database. Valid values are: S0, S1, S2, S3, P1, P2, P4, P6, P11 and ElasticPool. Please see Azure SQL Database Service Tiers. Defaults to S0"),
                    default: "S0"
                },
                DATABASE_CREATE_MODE: {
                    type: "string",
                    description: "(Optional) Specifies how to create the database. Valid values are: Default, Copy, OnlineSecondary, NonReadableSecondary, PointInTimeRestore, Recovery, Restore or RestoreLongTermRetentionBackup. Must be Default to create a new database. Defaults to Default.",
                    default: "Default"
                },
                DATABASE_SOURCE_ID: {
                    type: "string",
                    description: "(Optional) The URI of the source database if create_mode value is not Default.",
                    default: null
                }
            }
        }

        if (!terraform.isDependency(answers.databaseServer)) {
            variables.variable.DATABASE_SERVER = {
                type: "string",
                description: "(Required) Database server to create the database at"
            }

            variables.variable.DATABASE_SERVER_RESOURCE_GROUP = {
                type: "string",
                description: "(Required) Resource group where the SQL Server is located"
            }            
        }

        terraform.writeVariables(fs, variables, configFile);
    }
}