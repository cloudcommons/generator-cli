const path = require('path');
const rimraf = require('rimraf');

module.exports = function (spec, cb) {
    var tmpdir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'));
    rimraf.sync(tmpdir);
    var generators = spec.generators.keys();
    var generatorPromises = [];
    generators.each(k => {
        var genSpec = spec.generators[key];
        var promise = getPromise(genSpec);
        generatorPromises.push(promise);
    });    
}

function getPromise(genSpec) {
    return new Promise();
}