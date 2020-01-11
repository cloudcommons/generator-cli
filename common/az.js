function az(generator, args) {
    var rgs = generator.spawnCommandSync('az', args, {
        stdio: [process.stdout]
    });

    var json = rgs.output.toString().trim().substring(1);
    json = json.substring(0, json.length - 2);
    return JSON.parse(json);
}

module.exports.resourceGroups = function (generator) {
    return az(generator, ['group', 'list', '-o', 'json']);
}

module.exports.dnsZones = function(generator, resourceGroup) {
    return az(generator, ['network', 'dns' ,'zone' ,'list', '-g', resourceGroup, '-o', 'json']);
}

module.exports.vmSkus = function(generator, location) {
    return az(generator, ['vm', 'list-skus', '-l', location, '-o', 'json']);
}

module.exports.locations = function(generator) {
    return az(generator, ['account', 'list-locations', '-o', 'json']).map(function(location){
        return {
            name: location.displayName,
            value: location.name
        }
    });
}

module.exports.aksVersions = function(generator, location) {
    var aks = az(generator, ['aks', 'get-versions', '-l', location, '-o', 'json']);    
    return aks.orchestrators.map(function(version){
        return {
            name: version.isPreview ? `${version.orchestratorVersion} (Preview)` : version.orchestratorVersion,
            value: version.name
        }
    });
}

module.exports.aks