/**
 * Application writer
 */
module.exports = function (generator, answers) {
    var args = {
        name: answers.name,
        terraformRoot: answers.terraformRoot,
        subscription: answers.subscription,
        safeName: generateSafeName(answers.name),
        terraformVersion: '0.12.19'
    };

    copy(generator, "LICENSE");
    if (answers.features.includes("templates")) {
        copy(generator, "azure-pipelines/cloudcommons-terraform-validate.yaml", args);
        copy(generator, "azure-pipelines/cloudcommons-terraform-build.yaml", args);
        copy(generator, "azure-pipelines/cloudcommons-terraform-deploy.yaml", args);
    }

    if (answers.features.includes("pipelines")) {
        copy(generator, "azure-pipelines-ci.yaml", args);
        copy(generator, "azure-pipelines-cd.yaml", args);
    }
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

/**
 * Transform a string into a camelcase string
 * @param {*} str String to convert into camelcase
 */
function generateSafeName(str) {
    return str =>
        str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map(x => x.toLowerCase())
            .join('-');
}