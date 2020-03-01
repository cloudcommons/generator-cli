const cidrSplitter = require('cidr-split');
const invalidVnetCidrs = ["/0", "/1", "/2", "/3", "/4", "/5", "/6", "/7"];


/**
 * Based on the given parameters, returns a recommended network configuration
 * for Azure Kubernetes Service, following the recommendations indicated in
 * https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni
 */
module.exports.getNetworkConfiguration = function(ip, usage, nodes, podsPerNode) {
    if (typeof(nodes) === "string") nodes = parseInt(nodes);
    if (typeof(podsPerNode) === "string") podsPerNode = parseInt(podsPerNode);
    var vnetSize = this.getVNETMask(nodes, podsPerNode);
    var vnetCidr = `${ip}${vnetSize}`;
    var subnets = this.getSubnets(vnetCidr, usage);
    var clusterSubnet = subnets[0];
    var serviceSubnet = subnets[1];
    var ingressSubnet = subnets.length > 2 ? subnets[2] : undefined;

    return {
        params: {
            ip: ip,
            usage: usage,
            nodes: nodes,
            podsPerNode
        },
        vnetCidr: vnetCidr,
        dockerBridgeCidr: '172.17.0.1/16',
        clusterSubnet: clusterSubnet.toString(),
        serviceSubnet: serviceSubnet.toString(),
        ingressSubnet:  ingressSubnet ? ingressSubnet.toString() : undefined,        
    }
}

/**
 * Prints the recommended configuration to the given log
 */
module.exports.printRecommendation = function(config, log) {
    log('Based on you inputs, this is you Azure CNI advanced configuration recommendation');
    log(`Configuration: ${config.params.ip}, ${config.params.usage} accesible with up to ${config.params.nodes} nodes and ${config.params.podsPerNode} pods per node`);
    log(`VNET Cidr: ${config.vnetCidr}`);
    log(`Cluster subnet: ${config.clusterSubnet}`);
    log(`Service subnet: ${config.serviceSubnet}`);
    log(`Ingress subnet: ${config.ingressSubnet ? config.ingressSubnet : "N/A"}`);
    log(`DNS Service IP: ${config.dnsService}`);
    log(`Docker Bride CIDR: ${config.dockerBridgeCidr}`);
}

/**
 * Returns the subnets that fits better in the given cidr, depending on the intended use (public, private or hybrid)
 */
module.exports.getSubnets = function (cidr, usage) {

    switch (usage) {
        case "public":
        case "private":
            // Private/Public subnets only require to subnets, one for the cluster and one for the services
            return cidrSplitter.fromString(cidr)
                .split();
            break;
        case "hybrid":
            // Hybrid clusters creates an extra "Ingress" subnet, on which Load Balancer are allocated
            // This is useful when companies are using third-party firewall solutions, to avoid
            // passing all the internal cluster traffic through the firewall...
            var subnets = cidrSplitter.fromString(cidr).split();
            var clusterSubnet = subnets[0];
            var otherSubnets = subnets[1].split();
            var serviceSubnet = otherSubnets[0];
            var ingressSubnet = otherSubnets[1];
            return [clusterSubnet, serviceSubnet, ingressSubnet];
            break;
    }
}

/**
 * Based on the nodes and pods per node, this function calculates the subNetSize
 * @param {*} nodes 
 * @param {*} podsPerNode 
 */
module.exports.getVNETMask = function (nodes, podsPerNode) {
    var requiredIps = this.clusterIps(nodes, podsPerNode);
    if (requiredIps > 655536) console.warn("WARN: The Azure virtual network can be as large as /8, but is limited to 65,536 configured IP addresses.");
    var cidr = this.getSubnetMask(requiredIps);
    if (invalidVnetCidrs.includes(cidr)) throw "The Azure virtual network can be as large as /8, but is limited to 65,536 configured IP addresses."
    return cidr;
}

/**
 * Calculates the number of ips, required for the given nodes and pods per node
 */
module.exports.clusterIps = function (nodes, podsPerNode) {
    if (podsPerNode > 250) throw "The maximum number of pods per node in an AKS cluster is 250."
    // We use Microsoft AKS formula to calculate the Pod size and then multiply per 2
    // The first half of the VNET will be used for the cluster. The second half, for Services/Ingresses
    return ((nodes + 1) + ((nodes + 1) * podsPerNode)) * 2; 
}

/**
 * Given the number of ips we want to include in a subnet, this function calculates the IPv4 CIDR
 */
module.exports.getSubnetMask = function (subnetSize) {
    for (var power = 0; power <= 32; power++) {
        var min = Math.pow(2, power - 1);
        var max = Math.pow(2, power);
        if (subnetSize > min && subnetSize <= max) {
            return `/${32 - power}`;
        }
    }

    return false;
}

/**
 * Calculates the capacity of a cidr
 */
module.exports.cidrCapacity = function (cidr) {
    var range = [2];
    cidr = cidr.split('/');
    var longIp = ip2long(cidr[0]);
    var start = longIp & ((-1 << (32 - cidr[1])));
    var end = longIp + Math.pow(2, (32 - cidr[1])) - 1;
    return end - start;
}

/**
 * Transforms an IP into its long value equivalent
 * @param {*} ip_address 
 */
function ip2long ( ip_address ) {  
    var output = false;  
    var parts = [];  
    if (ip_address.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {  
        parts  = ip_address.split('.');  
        output = ( parts[0] * 16777216 +  
        ( parts[1] * 65536 ) +  
        ( parts[2] * 256 ) +  
        ( parts[3] * 1 ) );  
    }  
       
    return output;  
}  