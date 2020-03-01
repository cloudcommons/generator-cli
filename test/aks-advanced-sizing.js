const clusterPlanner = require('../generators/azure-aks/js/clusterPlanner');
const assert = require('assert');

describe("aks-sizing-tests", function () {

    it('Should calculate the required ips for the cluster', () => {
        assert.equal(clusterPlanner.clusterIps(1, 30), 124);
        assert.equal(clusterPlanner.clusterIps(1, 60), 244);
        assert.equal(clusterPlanner.clusterIps(5, 60), 732);
        assert.equal(clusterPlanner.clusterIps(50, 40), 4182);
    });

    it('Should calculate CIRDs ', () => {
        assert.equal(clusterPlanner.getSubnetMask(1), "/32");
        assert.equal(clusterPlanner.getSubnetMask(2), "/31");
        assert.equal(clusterPlanner.getSubnetMask(3), "/30");
        assert.equal(clusterPlanner.getSubnetMask(4), "/30");
        assert.equal(clusterPlanner.getSubnetMask(8), "/29");
        assert.equal(clusterPlanner.getSubnetMask(9), "/28");
        assert.equal(clusterPlanner.getSubnetMask(500), "/23");
        assert.equal(clusterPlanner.getSubnetMask(15900), "/18");
        assert.equal(clusterPlanner.getSubnetMask(524289), "/12");
        assert.equal(clusterPlanner.getSubnetMask(985770), "/12");
        assert.equal(clusterPlanner.getSubnetMask(1048576), "/12");
        assert.equal(clusterPlanner.getSubnetMask(1048577), "/11");
    });

    it('Should calculate the right Class A VNET size for a cluster ', () => {
        assert.equal(clusterPlanner.getVNETMask(1, 30), "/25");
        assert.equal(clusterPlanner.getVNETMask(1, 60), "/24");
        assert.equal(clusterPlanner.getVNETMask(5, 60), "/22");
        assert.equal(clusterPlanner.getVNETMask(50, 40), "/19");
        assert.equal(clusterPlanner.getVNETMask(50, 110), "/18");
        assert.throws(() => clusterPlanner.getVNETMask(1,251));
        assert.throws(() => clusterPlanner.getVNETMask(100000, 250));
    });

    it('Should generate the right Class A VNET subnets for a private cluster', () => {
        var subnets = clusterPlanner.getSubnets("10.0.0.0/16", "private");
        assert.equal(subnets.length, 2);
        assert.equal(subnets[0].toString(), "10.0.0.0/17");
        assert.equal(subnets[1].toString(), "10.0.128.0/17");
    });

    it('Should generate the right Class A VNET subnets for a public cluster', () => {
        var subnets = clusterPlanner.getSubnets("10.0.0.0/16", "public");
        assert.equal(subnets.length, 2);
        assert.equal(subnets[0].toString(), "10.0.0.0/17");
        assert.equal(subnets[1].toString(), "10.0.128.0/17");
    });

    it('Should generate the right Class A VNET subnets for a hybrid cluster of /12', () => {
        var subnets = clusterPlanner.getSubnets("10.0.0.0/12", "hybrid");
        assert.equal(subnets.length, 3);
        assert.equal(subnets[0].toString(), "10.0.0.0/13");
        assert.equal(subnets[1].toString(), "10.8.0.0/14");
        assert.equal(subnets[2].toString(), "10.12.0.0/14");
    });

    it('Should generate the right Class A VNET subnets for a hybrid cluster of /16', () => {
        var subnets = clusterPlanner.getSubnets("10.0.0.0/16", "hybrid");
        assert.equal(subnets.length, 3);
        assert.equal(subnets[0].toString(), "10.0.0.0/17");
        assert.equal(subnets[1].toString(), "10.0.128.0/18");
        assert.equal(subnets[2].toString(), "10.0.192.0/18");
    });


    it('Should generate the right Class B VNET subnets for a hybrid cluster of /16', () => {
        var subnets = clusterPlanner.getSubnets("172.16.0.0/16", "hybrid");
        assert.equal(subnets.length, 3);
        assert.equal(subnets[0].toString(), "172.16.0.0/17");
        assert.equal(subnets[1].toString(), "172.16.128.0/18");
        assert.equal(subnets[2].toString(), "172.16.192.0/18");
    });    

    it('Should create subnets that accomodates to a public cluster of 1 node and 60 pods per node', () => {
        var nodes = 1;
        var podsPerNode = 60;
        var kind = "public";
        var subNetIp = "172.0.0.0";        

        var subnetMask = clusterPlanner.getVNETMask(nodes, podsPerNode);
        var cidr = `${subNetIp}${subnetMask}`;         
        var requiredIps = clusterPlanner.clusterIps(nodes, podsPerNode);
        var subnets = clusterPlanner.getSubnets(cidr, kind);
        var clusterSubnetCidr = subnets[0].toString();
        var clusterSubnetCapacity = clusterPlanner.cidrCapacity(clusterSubnetCidr);
        
        assert.ok(clusterSubnetCapacity > requiredIps, `The subnet is not big enough for all the pods: ${clusterSubnetCapacity} > ${requiredIps}`);
        assert.ok(subnets.length, 3, "The number of Subnets is not correct");
    });    


    it('Should create subnets that accomodates to a public cluster of 4 nodes and 60 pods per node', () => {
        var nodes = 4;
        var podsPerNode = 60;
        var kind = "public";
        var subNetIp = "10.0.0.0";        

        var subnetMask = clusterPlanner.getVNETMask(nodes, podsPerNode);
        var cidr = `${subNetIp}${subnetMask}`;         
        var requiredIps = clusterPlanner.clusterIps(nodes, podsPerNode);
        var subnets = clusterPlanner.getSubnets(cidr, kind);
        var clusterSubnetCidr = subnets[0].toString();
        var clusterSubnetCapacity = clusterPlanner.cidrCapacity(clusterSubnetCidr);

        assert.ok(clusterSubnetCapacity <= requiredIps, "The subnet is not big enough for all the pods");
        assert.ok(subnets.length, 2, "The number of Subnets is not correct");
    });

    it('Should propose the right configuration for a Class A public cluster with 4 nodes and 60 pods per node', () => {
        var nodes = 4;
        var podsPerNode = 60;
        var kind = "public";
        var subNetIp = "10.0.0.0";  

        var config = clusterPlanner.getNetworkConfiguration(subNetIp, kind, nodes, podsPerNode);

        assert.equal(config.vnetCidr, "10.0.0.0/22");
        assert.equal(config.clusterSubnet, "10.0.0.0/23"); 
        assert.equal(config.serviceSubnet, "10.0.2.0/23");        
        assert.equal(config.ingressSubnet, undefined);
        assert.equal(config.dockerBridgeCidr, "172.17.0.1/16");        
    });

    it('Should propose the right configuration for a Class B hybrid cluster with 200 nodes and 40 pods per node', () => {
        var nodes = 200;
        var podsPerNode = 40;
        var kind = "hybrid";
        var subNetIp = "172.16.0.0";  

        var config = clusterPlanner.getNetworkConfiguration(subNetIp, kind, nodes, podsPerNode);

        assert.equal(config.vnetCidr, "172.16.0.0/17");
        assert.equal(config.clusterSubnet, "172.16.0.0/18");  
        assert.equal(config.serviceSubnet, "172.16.64.0/19");        
        assert.equal(config.ingressSubnet, "172.16.96.0/19");
        assert.equal(config.dockerBridgeCidr, "172.17.0.1/16");        
    }); 
    
    it('Should propose the right configuration for a Class B hybrid cluster with 1 node and 60 pods per node', () => {
        var nodes = 1;
        var podsPerNode = 60;
        var kind = "public";
        var subNetIp = "172.16.0.0";  

        var config = clusterPlanner.getNetworkConfiguration(subNetIp, kind, nodes, podsPerNode);

        assert.equal(config.vnetCidr, "172.16.0.0/24");
        assert.equal(config.clusterSubnet, "172.16.0.0/25");  
        assert.equal(config.serviceSubnet, "172.16.0.128/25");      
        assert.equal(config.ingressSubnet, undefined);
        assert.equal(config.dockerBridgeCidr, "172.17.0.1/16");        
    });     

    it('Should propose the right configuration for a Class B hybrid cluster with 1 node and 60 pods per node when values are passed as string', () => {
        var nodes = "1";
        var podsPerNode = "60";
        var kind = "public";
        var subNetIp = "172.16.0.0";  

        var config = clusterPlanner.getNetworkConfiguration(subNetIp, kind, nodes, podsPerNode);

        assert.equal(config.vnetCidr, "172.16.0.0/24");
        assert.equal(config.clusterSubnet, "172.16.0.0/25");  
        assert.equal(config.serviceSubnet, "172.16.0.128/25");      
        assert.equal(config.ingressSubnet, undefined);
        assert.equal(config.dockerBridgeCidr, "172.17.0.1/16");        
    });
    
    it('Should propose the right configuration for a Class B hybrid cluster with 133 node and 60 pods per node when values are passed as string', () => {
        var nodes = "133";
        var podsPerNode = "60";
        var kind = "public";
        var subNetIp = "172.16.0.0";  

        var config = clusterPlanner.getNetworkConfiguration(subNetIp, kind, nodes, podsPerNode);

        assert.equal(config.vnetCidr, "172.16.0.0/18");
        assert.equal(config.clusterSubnet, "172.16.0.0/19");  
        assert.equal(config.serviceSubnet, "172.16.32.0/19");      
        assert.equal(config.ingressSubnet, undefined);
        assert.equal(config.dockerBridgeCidr, "172.17.0.1/16");        
    });           
});