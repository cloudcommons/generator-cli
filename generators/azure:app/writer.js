/**
 * Application writer
 */
module.exports = function (generator, answers) {
    var args = {
        name: answers.name,
        location: "westeurope",
        ingressChart: "stable/nginx-ingress",
        ingressVersion: "1.5.0"
    }
    
    copy(generator, "LICENSE");
    copy(generator, "outputs.tf");
    copy(generator, "variables.tf", args);
    copy(generator, "app.tf", args);
    copy(generator, "providers.tf");
    copy(generator, "docker-secret.tf", args);
    copy(generator, '__init__.tf', { version: "v0.12.18", backend: "local" });
    copy(generator, 'nginx-ingress.tf', args);
    copy(generator, 'templates/ingress.yml');
    copy(generator, 'ip.tf', args);
    copy(generator, 'dns.tf', args);
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