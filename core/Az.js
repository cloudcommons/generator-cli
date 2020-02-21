module.exports = class {
    constructor(spawn, log) {
        this.spawn = spawn;
        this.log = log;
    }

    /**
     * Executes a terraform command and parses the JSON result
     * @param {*} args 
     */
    _az(args) {
        if (process.env.mockAzure === "true") return this._azMock(args);        
        var rgs = this.spawn('az', args, {
            stdio: ['ignore', 'pipe', process.stderr]
        });

        var json = rgs.stdout.toString();
        if (json && json.startsWith(",ERROR:")) {
            this.log(json);
            throw json;
        }
        try {
            return JSON.parse(json);
        } catch (e) {
            this.log(`Error parsing az response: ${json}`);
            this.log(`${e}`);
            throw e;
        }
    }

    _azMock(args) {
        var filename = "../test/mocks/azure/responses/";
        for (var i = 0; i < args.length; i++)
        {
            var arg = new String(args[i]);
            if (arg.startsWith('-')) {
                break;
            }
            
            filename += `${arg}-`
        }

        filename = filename.substring(0, filename.length - 1);        
        try {
            return require(filename);            
        } catch (e) {
            throw new Error(`Error loading mock file: ${filename}`);
        }
    }

    /**
     * Get all resourcse groups
     * @param {*} name list property name
     * @param {*} value list property value
     */
    resourceGroups(name = 'name', value = 'name') {
        return this._az(['group', 'list', '-o', 'json']).map(rg => {
            return {
                name: rg[name],
                value: rg[value]
            }
        });
    }

    /**
     * List all DNS zones in a resource group
     * @param {*} resourceGroup 
     */
    dnsZones(resourceGroup) {
        return this._az(['network', 'dns', 'zone', 'list', '-g', resourceGroup, '-o', 'json']);
    }

    /**
     * List all VM SKUs in an Azure location
     * @param {*} location 
     */
    vmSkus(location) {
        return this._az(['vm', 'list-skus', '-l', location, '-o', 'json']);
    }

    /**
     * List all Azure regions available for this subscription
     * @param {*} name 
     * @param {*} value 
     */
    locations(name = 'displayName', value = 'name') {
        return this._az(['account', 'list-locations', '-o', 'json']).map(function (location) {
            return {
                name: location[name],
                value: location[value]
            }
        });
    }

    /**
     * List all AKS versions available for the given location
     * @param {*} location Azure location
     */
    aksVersions(location) {
        var aks = this._az(['aks', 'get-versions', '-l', location, '-o', 'json']);
        return aks.orchestrators.map(function (version) {
            return {
                name: version.isPreview ? `${version.orchestratorVersion} (Preview)` : version.orchestratorVersion,
                value: version.orchestratorVersion
            }
        });
    }

    /**
     * List all AKS clusters in a resource group
     * @param {*} resourceGroup Resource group
     * @param {*} name List display property to extract from the JSON
     * @param {*} value List value property to extract from the JSON
     */
    aksClusters(resourceGroup, name = 'name', value = 'id') {
        return this._az(['aks', 'list', '-g', resourceGroup]).map(function (server) {
            return {
                name: server[name],
                value: server[value]
            }
        });
    }

    sqlServers(resourceGroup, name = 'name', value = 'id') {
        return this._az(['sql', 'server', 'list', '-g', resourceGroup]).map(function (server) {
            return {
                name: server[name],
                value: server[value]
            }
        });
    }

    /**
     * List all SQL Server databases in a server
     * @param {*} serverId ServerID
     * @param {*} name List display property to extract from the JSON
     * @param {*} value List value property to extract from the JSON
     */
    sqlDatabases(serverId, name = 'name', value = 'id') {
        return this._az(['sql', 'db', 'list', '--ids', serverId]).map(function (database) {
            return {
                name: database[name],
                value: database[value]
            }
        });
    }

    /**
     * List all storage accounts in a resource group
     * @param {*} resourceGroup 
     */
    storageAccounts(resourceGroup) {
        return this._az(['storage', 'account', 'list', '-g', resourceGroup]).map(function (account) {
            return account.name;
        });
    }

    /**
     * List all containers in the given storage account
     * @param {*} account 
     */
    storageContainers(account) {
        return this._az(['storage', 'container', 'list', '--account-name', account]).map(function (container) {
            return container.name;
        });
    }


    /**
     * List all VNETs in a resource group
     * @param {*} resourceGroup 
     */
    vnets(resourceGroup) {
        return this._az(['network', 'vnet', 'list', '-g', resourceGroup]).map(function (vnet) {
            return vnet.name;
        });
    }

    /**
     * List all VNET subnets in a resource group
     * @param {*} resourceGroup Resource group
     * @param {*} vnet VNET Id
     * @param {*} name List display property to extract from the JSON
     * @param {*} value List value property to extract from the JSON
     */
    vnetSubnets(resourceGroup, vnet, name = 'name', value = 'id') {
        return this._az(['network', 'vnet', 'subnet', 'list', '-g', resourceGroup, '--vnet-name', vnet]).map(function (subnet) {
            return {
                name: subnet[name],
                value: subnet[value]
            }
        });
    }

    /**
     * List all resources in a resource group
     * @param {*} resourceGroup Resource group
     * @param {*} name List display property to extract from the JSON
     * @param {*} value List value property to extract from the JSON
     */
    resources(resourceGroup, name = 'name', value = 'id') {
        return this._az(['resource', 'list', '-g', resourceGroup]).map((resource) => {
            return {
                name: resource[name],
                value: resource[value]
            }
        });
    }

    /**
     * Gets a VNET subnet information
     * @param {*} subnetId SubnetID
     */
    vnetSubnetInformation(subnetId) {
        return this._az(['network', 'vnet', 'subnet', 'show', '--ids', subnetId]);
    }
}
