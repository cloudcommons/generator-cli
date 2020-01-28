var terraform = require('../../../common/terraform');
var merge = require('../../../common/merge');

module.exports = {
    copy: function (fs, answers) {
        var db = `azurerm_sql_database.${answers.name}`;
        var output = {
            output: {
                SQL_DATABASE_ID: {
                    description: "SQL Server Ids",
                    value: terraform.toVariable(`${db}.id`)
                },
                SQL_DATABASE_CREATION_DATE: {
                    description: "SQL Server Fully Qualified Domain names",
                    value: terraform.toVariable(`${db}.creation_date`)
                },
                SQL_DATABASE_DEFAULT_SECONDARY_LOCATION: {
                    description: "SQL Server Identities",
                    value: terraform.toVariable(`${db}.default_secondary_location`)
                }
            }
        }

        terraform.writeOutput(fs, output);
    }
}

