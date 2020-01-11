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

module.exports.aks