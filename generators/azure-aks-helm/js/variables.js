module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                RELEASE_NAME: {
                    type: "string",
                    description: ("(Required) Name of the helm release")
                },
                APP_CHART: {
                    type: "string",
                    description: (" (Required) Helm chart name")
                },
                APP_CHART_VERSION: {
                    type: "string",
                    description: (" (Optional) Helm chart version. Defaults to latest"),
                    default: "latest"
                },
                HELM_RECREATE_PODS: {
                    type: "string",
                    description: (" (Optional) Should pods be recreated? Defaults to true"),
                    default: true
                }
            }
        }        

        if (answers.tlsEnabled) {
            variables.variable = Object.assign({
                CLUSTER_ISSUER: {
                    type: "string",
                    description: "cert-manager Issuer or ClusterIssuer name. Defaults to letsencrypt",
                    default: "letsencrypt"
                }
            }, variables.variable);
        }

        terraform.writeVariables(variables, configFile);
    }
}