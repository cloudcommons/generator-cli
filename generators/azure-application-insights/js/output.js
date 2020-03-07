module.exports = {
    copy: function (terraform, answers) {
        var output = {
            output: {
                APP_INSIGHTS_ID: {
                    description: "Application Insights Id",
                    value: terraform.toVariable(`azurerm_application_insights.${answers.name}.id`)
                },
                APP_INSIGHTS_APP_ID: {
                    description: "Application Insights Application Id",
                    value: terraform.toVariable(`azurerm_application_insights.${answers.name}.app_id`)
                },
                APP_INSIGHTS_INSTRUMENTATION_KEY: {
                    description: "Application Insights instrumentation key",
                    value: terraform.toVariable(`azurerm_application_insights.${answers.name}.instrumentation_key`),
                    sensitive: true
                }                          
            }
        }

        terraform.writeOutput(output);
    }
}                                