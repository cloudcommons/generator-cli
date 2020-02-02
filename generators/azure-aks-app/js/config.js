var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            APP_NAME: answers.name,
            CREATOR: "cloudcommons",
            LOCATION: answers.location, // TODO This is used only for for ingress IP Address. We should replace location by reading the location of the AKS cluster.
            AKS_MANAGED_RESOURCE_GROUP: answers.aksResourceGroup, // TODO We can replace this by prompting the user to choose an existing Kubernetes Cluster (or referencing a local one) and then read the Terraform AKS module output variable
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