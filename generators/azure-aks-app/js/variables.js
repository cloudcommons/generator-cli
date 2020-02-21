module.exports = {
    copy: function (terraform, answers) {
        var variables = {
            "variable": {
                APP: {
                    type: "string",
                    description: "(Required) Application name this cluster belongs to",
                    default: answers.name
                },
                APP_IMAGE_REPOSITORY: {
                    type: "string",
                    description: "(Required) App docker image, including private Container Registry and route to the image"
                },
                APP_IMAGE_TAG: {
                    type: "string",
                    description: "(Required) Docker image tag. Defaults to 'latest'",
                    default: "latest"
                },
                APP_IMAGE_PULLPOLICY: {
                    type: "string",
                    description: "(Optional) Docker image pull policy. Defaults to 'Always'",
                    default: "Always"
                },
                APP_IMAGE_REPLICACOUNT: {
                    type: "number",
                    description: "(Optional) Application replicas to create. Defaults to 2",
                    default: 2
                },
                APP_INGRESS_TLS_ENABLED: {
                    type: "bool",
                    description: "(Optional) Is TLS enabled for the application? Defaults to true",
                    default: true
                },
                CLUSTER_ISSUER: {
                    type: "string",
                    description: "cert-manager Issuer or ClusterIssuer name. Defaults to letsencrypt",
                    default: "letsencrypt"
                },
                MANUAL_INGRESS_HOSTNAME: {
                    type: "string",
                    description: "(Optional) When DNS Zone is disabled, use this variable to add a hostname to the ingress. This property is ignored if the DNS Zone is enabled",
                    default: null
                },                
            }
        }

        terraform.writeVariables(variables);
    }
}