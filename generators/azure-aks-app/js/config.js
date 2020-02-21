module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            APP: answers.name,
            APP_IMAGE_REPOSITORY: answers.imageName,
            APP_IMAGE_TAG: answers.imageTag,
            APP_IMAGE_REPLICACOUNT: answers.imageReplicaCount,
            APP_IMAGE_PULLPOLICY: answers.imagePullPolicy,
            APP_INGRESS_TLS_ENABLED: answers.tlsEnabled,
            CLUSTER_ISSUER: answers.certificateIssuer,
            MANUAL_INGRESS_HOSTNAME: answers.ingressHostname
        }

        terraform.writeConfig(config, configFile);
    }
}