module.exports = {
    copy: function (terraform, answers) {
        var variables = {
            "variable": {
                APP_NAME: {
                    type: "string",
                    description: "(Required) Application name this cluster belongs to",
                    default: answers.name
                },
                CREATOR: {
                    type: "string",
                    description: "(Required) Creator of this deployment"
                },
                LOCATION: {
                    type: "string",
                    description: "(Required) Azure region to perform the deployment"
                },
                AKS_MANAGED_RESOURCE_GROUP: {
                    type: "string",
                    description: "(Required) The name of the Kubernetes managed resource group to create cluster-related infrastructure"
                },
                HELM_RECREATE_PODS: {
                    type: "bool",
                    description: "(Optional) Recreate pods after deploying?. Defaults to true",
                    default: true
                },
                DOCKER_REPO_SERVER: {
                    type: "string",
                    description: "(Optional) Docker private repository hostname",
                    default: null
                },
                DOCKER_REPO_USERNAME: {
                    type: "string",
                    description: "(Optional) Docker repository username",
                    default: null
                },
                DOCKER_REPO_PASSWORD: {
                    type: "string",
                    description: "(Optional) Docker repository password",
                    default: null
                },
                DOCKER_REPO_EMAIL: {
                    type: "string",
                    description: "(Optional) Docker repository email",
                    default: null
                },
                DOCKER_SECRET_NAME: {
                    type: "string",
                    description: "(Optional) Docker repository secret name",
                    default: null
                },
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
                INGRESS_IP: {
                    type: "string",
                    description: "(Optional) When Ingress is internal, use this variable to specify the Ingress private IP address. This IP should belog to to the INGRESS_SERVICE_SUBNET VNET subnet",
                    default: null
                },
                INGRESS_REPLICAS: {
                    type: "number",
                    description: `(Optional) Ingress pods replica. Defaults to 2`,
                    default: 2
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
                DNS_ZONE_ENABLED: {
                    type: "bool",
                    description: "(Optional) Should a DNS entry created in an Azure DNS zone?",
                    default: false
                },
                DNS_ZONE_NAME: {
                    type: "string",
                    description: "(Optional) Domain name to create new domain entries",
                    default: null
                },
                DNS_ZONE_RESOURCE_GROUP: {
                    type: "string",
                    description: "(Required if DNS_ZONE_NAME specified) Resource group where the DNS ZONE is created on",
                    default: null
                },
                DNS_ZONE_RECORD: {
                    type: "string",
                    description: "(Required if DNS_ZONE_NAME specified) Domain name to create a new A entry, without the DNS Zone",
                    default: null
                },
                DNS_TTL: {
                    type: "number",
                    description: "(Optional) DNS entry TTL. Defaults to 3600",
                    default: 3600
                }
            }
        }

        terraform.writeVariables(variables);
    }
}