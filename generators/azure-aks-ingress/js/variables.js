module.exports = {
    copy: function (terraform, answers) {
        var variables = {
            "variable": {
                INGRESS_ENABLED: {
                    type: "bool",
                    description: "(Optional) Creates an nginx-ingress for this application. Defaults to true",
                    default: true
                },
                INGRESS_HOSTNAME: {
                    type: "string",
                    description: "(Optional) When DNS Zone is disabled, use this variable to add a hostname to the ingress. This property is ignored if the DNS Zone is enabled",
                    default: null
                },
                INGRESS_CHART: {
                    type: "string",
                    description: `(Optional) Ingress Helm chart name or folder. Defaults to ${answers.ingressChart}`,
                    default: answers.ingressChart
                },
                INGRESS_CHART_VERSION: {
                    type: "string",
                    description: `(Optional) Ingress Helm chart version. Defaults to ${answers.ingressChartVersion}`,
                    default: answers.ingressChartVersion
                },
                INGRESS_SERVICE_SUBNET: {
                    type: "string",
                    description: "(Optional) When deploying internal ingresses, this variable allows you to allocate a load balancer in an specific VNET subnet",
                    default: null
                },
                INGRESS_RECREATE_PODS: {
                    type: "bool",
                    description: "(Optional) Should the helm release recreate pods when deploying ingress chart changes? Defaults to true",
                    default: true
                },
                INGRESS_IP: {
                    type: "string",
                    description: "(Optional) When Ingress is internal, use this variable to specify the Ingress private IP address. This IP should belog to to the INGRESS_SERVICE_SUBNET VNET subnet",
                    default: null
                },
                INGRESS_REPLICAS: {
                    type: "number",
                    description: `(Optional) Ingress pods replica. Defaults to 2`,
                    default: 2
                }                
            }
        }

        terraform.writeVariables(variables);
    }
}