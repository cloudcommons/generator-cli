/**
 * Application writer
 */
module.exports = function (generator, answers) {

    var chartParts = answers.ingressChartAndVersion ? answers.ingressChartAndVersion.split(":") : null;
    var args = {
        name: answers.name,
        // Deployment
        imageName: answers.imageName,
        imageTag: answers.imageTag,
        imageReplicaCount: answers.imageReplicaCount ? answers.imageReplicaCount : 2,
        imagePullPolicy: answers.imagePullPolicy,
        privateRegistryEnabled: answers.features.includes("privateRegistry"), 
        dockerRepoServer: answers.dockerRepoServer,
        dockerRepoUser: answers.dockerRepoUser,
        dockerRepoPassword: answers.dockerRepoPassword,
        dockerRepoEmail: answers.dockerRepoEmail,
        dockerSecretName: answers.dockerSecretName,
        // Ingress
        ingressHostname: answers.ingressHostname,
        ingressEnabled: answers.features.includes("ingress"),        
        internalLoadBalancer: answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer",
        ingressServiceSubnet: answers.ingressServiceSubnet,
        privateLoadBalancerIp: answers.privateLoadBalancerIp,
        location: answers.ipLocation ? answers.ipLocation : "westeurope",
        aksResourceGroup: answers.aksResourceGroup,
        ingressChart: chartParts ? chartParts[0] : null,
        ingressChartVersion: chartParts ? chartParts[1] : null,
        ingressReplicas: answers.ingressReplicas ? answers.ingressReplicas : 2,
        ingressServiceName: answers.ingressServiceName,
        ingressServiceSubnet: answers.ingressServiceSubnet,
        // TLS
        tlsEnabled: answers.features.includes("tls"),
        certificateIssuer: answers.certificateIssuer,
        // DNS
        dnsZoneEnabled: answers.features.includes("dns"),
        dnsZoneName: answers.dnsZoneName,
        dnsZoneResourceGroup: answers.dnsZoneResourceGroup,
        dnsZoneRecord: answers.dnsZoneRecord,
        dnsZoneRecordTtl: answers.dnsZoneRecordTtl
    }
    
    copy(generator, "LICENSE");
    copy(generator, "terraform.tfvars", args);
    generator.log("Writing");
    copy(generator, "variables.tf", args);
    copy(generator, "outputs.tf", args);    
    copy(generator, "app.tf", args);
    copy(generator, "providers.tf");
    if (args.privateRegistryEnabled) {
        copy(generator, "docker-secret.tf", args);
    }
    
    copy(generator, '__init__.tf', { version: "~> v0.12.19", backend: "local" });
    copy(generator, 'nginx-ingress.tf', args);
    copy(generator, 'templates/ingress.yml', args);
    if (!args.internalLoadBalancer)
        copy(generator, 'ip.tf', args);
    if (args.dnsZoneEnabled) {
        copy(generator, 'dns.tf', args);
    }
    copy(generator, '.gitignore');
}

/**
 * Copies a file from the source path to the exact same location in destination
 * @param {*} generator Yeoman generator
 * @param {*} source Source path
 * @param {*} parameters Object with parameters to replace
 */
function copy(generator, source, parameters) {
    generator.fs.copyTpl(
        generator.templatePath(source),
        generator.destinationPath(source),
        parameters
    );
}

/**
 * Copies a file from the source to a given destination path
 * @param {*} generator Yeoman generator
 * @param {*} source Source path
 * @param {*} destination Target path
 * @param {*} parameters Object with parameters to replace
 */
function copyTo(generator, source, destination, parameters) {
    generator.fs.copyTpl(
        generator.templatePath(source),
        generator.destinationPath(destination),
        parameters
    );
}