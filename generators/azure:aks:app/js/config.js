var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            APP: answers.name,
            CREATOR: "cloudcommons",
            LOCATION: answers.location,
            AKS_MANAGED_RESOURCE_GROUP: answers.aksResourceGroup,
            DOCKER_REPO_SERVER: answers.dockerRepoServer,
            DOCKER_REPO_USERNAME: answers.dockerRepoUser,
            DOCKER_REPO_PASSWORD: answers.dockerRepoPassword,
            DOCKER_REPO_EMAIL: answers.dockerRepoEmail,
            DOCKER_SECRET_NAME: answers.dockerSecretName,
            INGRESS_ENABLED: answers.ingressEnabled,
            INGRESS_HOSTNAME: answers.ingressHostname,
            INGRESS_SUBNET: answers.ingressServiceSubnet,
            INGRESS_IP: answers.privateLoadBalancerIp,
            INGRESS_CHART: answers.ingressChart,
            INGRESS_CHART_VERSION: answers.ingressChartVersion,
            INGRESS_REPLICAS: answers.ingressReplicas,
            INGRESS_SERVICE_SUBNET: answers.ingressServiceSubnet,
            APP_IMAGE_REPOSITORY: answers.imageName,
            APP_IMAGE_TAG: answers.imageTag,
            APP_IMAGE_REPLICACOUNT: answers.imageReplicaCount,
            APP_IMAGE_PULLPOLICY: answers.imagePullPolicy,
            APP_INGRESS_TLS_ENABLED: answers.tlsEnabled,
            CLUSTER_ISSUER: answers.certificateIssuer,
            DNS_ZONE_ENABLED: answers.dnsZoneEnabled,
            DNS_ZONE_NAME: answers.dnsZoneName,
            DNS_ZONE_RESOURCE_GROUP: answers.dnsZoneResourceGroup,
            DNS_ZONE_RECORD: answers.dnsZoneRecord,
            DNS_TTL: answers.dnsZoneRecordTtl
        }

        terraform.writeConfig(fs, config, configFile);
    }
}
// CREATOR                    = "CloudCommons"
// APP_NAME                   = "<%= name %>"
// LOCATION                   = "<%= location %>"
// AKS_MANAGED_RESOURCE_GROUP = "<%= aksResourceGroup %>"
// <% if (privateRegistryEnabled) { %>
// DOCKER_REPO_SERVER         = "<%= dockerRepoServer %>"
// DOCKER_REPO_USERNAME       = "<%= dockerRepoUser %>"
// DOCKER_REPO_PASSWORD       = "<%= dockerRepoPassword %>"
// DOCKER_REPO_EMAIL          = "<%= dockerRepoEmail %>"
// DOCKER_SECRET_NAME         = "<%= dockerSecretName %>"
// <% } %>
// INGRESS_ENABLED            = <%= ingressEnabled %>
// <% if (!dnsZoneEnabled) { %>
// INGRESS_HOSTNAME           = "<%= ingressHostname %>"
// <% } %>
// <% if (internalLoadBalancer) { %>
// INGRESS_SUBNET             = "<%= ingressServiceSubnet %>"
// INGRESS_IP                 = "<%= privateLoadBalancerIp %>"
// <% } %>
// INGRESS_CHART              = "<%= ingressChart %>"
// INGRESS_CHART_VERSION      = "<%= ingressChartVersion %>"
// INGRESS_REPLICAS           = <%= ingressReplicas %>
// INGRESS_SERVICE_SUBNET     = "<%= ingressServiceSubnet %>"
// APP_IMAGE_REPOSITORY       = "<%= imageName %>"
// APP_IMAGE_TAG              = "<%= imageTag %>"
// APP_IMAGE_REPLICACOUNT     = "<%= imageReplicaCount %>"
// APP_IMAGE_PULLPOLICY       = "<%= imagePullPolicy %>"
// APP_INGRESS_TLS_ENABLED    = <%= tlsEnabled %>
// CLUSTER_ISSUER             = "<%= certificateIssuer %>"
// DNS_ZONE_ENABLED           = dnsZoneEnabled
// <% if (dnsZoneEnabled) { %>
// DNS_ZONE_NAME              = "<%= dnsZoneName %>"
// DNS_ZONE_RESOURCE_GROUP    = "<%= dnsZoneResourceGroup %>"
// DNS_ZONE_RECORD            = "<%= dnsZoneRecord %>"
// DNS_TTL                    = "<%= dnsZoneRecordTtl %>"
// <% } %>