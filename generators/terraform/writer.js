/**
 * Application writer
 */
module.exports = function (generator, answers) {

    copy(generator, "LICENSE");
    copyTo(generator, 'gitignore', '.gitignore');
    copyTo(generator, `init/${answers.backendType}.tf`, '__init__.tf', answers);
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