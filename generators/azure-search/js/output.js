var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {

        var outputBase = `azurerm_search_service.${answers.name}`;
        var output = {
            output: {
                SEARCH_ID: {
                    description: "Azure Search Service ID",
                    value: terraform.toVariable(`${outputBase}.id`)
                },
                SEARCH_PRIMARY_KEY: {
                    description: "Azure Search Administrator primary key",
                    value: terraform.toVariable(`${outputBase}.primary_key`),
                    sensitive: true
                },
                SEARCH_SECONDARY_KEY: {
                    description: "Azure Search Administrator secondary Key",
                    value: terraform.toVariable(`${outputBase}.secondary_key`),
                    sensitive: true
                },
                SEARCH_QUERY_KEYS: {
                    description: "A block containing the query name and keys",
                    value: terraform.toVariable(`${outputBase}.query_keys`),
                    sensitive: true
                }
            }
        }

        terraform.writeOutput(fs, output);
    }
}

