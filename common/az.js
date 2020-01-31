
function az(generator, args) {

    var rgs = generator.spawnCommandSync('az', args, {
        stdio: ['ignore', 'pipe', process.stderr]
    });

    var json = rgs.stdout.toString();
    if (json && json.startsWith(",ERROR:")) {
        generator.log(json);
        throw json;
    }
    try {
        return JSON.parse(json);
    } catch (e) {
        generator.log(`Error parsing az response: ${json}`);
        generator.log(`${e}`);
        throw e;
    }
}

module.exports.resourceGroups = function (generator, name = 'name', value = 'name') {
    return az(generator, ['group', 'list', '-o', 'json']).map(rg => {
        return {
            name: rg[name],
            value: rg[value]
        }
    });
}

module.exports.dnsZones = function (generator, resourceGroup) {
    return az(generator, ['network', 'dns', 'zone', 'list', '-g', resourceGroup, '-o', 'json']);
}

module.exports.vmSkus = function (generator, location) {
    return az(generator, ['vm', 'list-skus', '-l', location, '-o', 'json']);
}

module.exports.locations = function (generator, name = 'displayName', value = 'name') {
    return az(generator, ['account', 'list-locations', '-o', 'json']).map(function (location) {
        return {
            name: location[name],
            value: location[value]
        }
    });
}

module.exports.aksVersions = function (generator, location) {
    var aks = az(generator, ['aks', 'get-versions', '-l', location, '-o', 'json']);
    return aks.orchestrators.map(function (version) {
        return {
            name: version.isPreview ? `${version.orchestratorVersion} (Preview)` : version.orchestratorVersion,
            value: version.orchestratorVersion
        }
    });
}

module.exports.sqlServers = function (generator, resourceGroup, name = 'name', value = 'id') {
    return az(generator, ['sql', 'server', 'list', '-g', resourceGroup]).map(function (server) {
        return {
            name: server[name],
            value: server[value]
        }
    });
}

module.exports.sqlDatabases = function (generator, serverId, name = 'name', value = 'id') {
    return az(generator, ['sql', 'db', 'list', '--ids', serverId]).map(function (database) {
        return {
            name: database[name],
            value: database[value]
        }
    });
}

module.exports.storageAccounts = function (generator, resourceGroup) {
    return az(generator, ['storage', 'account', 'list', '-g', resourceGroup]).map(function (account) {
        return account.name;
    });
}

module.exports.storageContainers = function (generator, account) {
    return az(generator, ['storage', 'container', 'list', '--account-name', account]).map(function (container) {
        return container.name;
    });
}

module.exports.vnets = function (generator, resourceGroup) {
    return az(generator, ['network', 'vnet', 'list', '-g', resourceGroup]).map(function (vnet) {
        return vnet.name;
    });
}
module.exports.vnetSubnets = function (generator, resourceGroup, vnet, name = 'name', value = 'id') {
    return az(generator, ['network', 'vnet', 'subnet', 'list', '-g', resourceGroup, '--vnet-name', vnet]).map(function (subnet) {
        return {
            name: subnet[name],
            value: subnet[value]
        }
    });
}

module.exports.resources = function (generator, resourceGroup, name = 'name', value = 'id') {
    return az(generator, ['resource', 'list', '-g', resourceGroup]).map((resource) => {
        return {
            name: resource[name],
            value: resource[value]
        }
    });
}

module.exports.vnetSubnetInformation = function (generator, subnetId) {
    return az(generator, ['network', 'vnet', 'subnet', 'show', '--ids', subnetId]);
}