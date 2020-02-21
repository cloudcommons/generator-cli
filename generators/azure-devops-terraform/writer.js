
module.exports = function (fsTools, answers) {

    answers = Object.assign({
        safeName: generateSafeName(answers.name),
        terraformVersion: '0.12.19' // TODO Read this value from configuration/answers, to match the terraform version selected by the user and the one set in the pipelines
    }, answers);

    if (answers.features.includes("templates")) {
        fsTools.copy("azure-pipelines/cloudcommons-terraform-validate.yaml", answers);
        fsTools.copy("azure-pipelines/cloudcommons-terraform-build.yaml", answers);
        fsTools.copy("azure-pipelines/cloudcommons-terraform-deploy.yaml", answers);
    }

    if (answers.features.includes("pipelines")) {
        fsTools.copy("azure-pipelines-ci.yaml", answers);
        fsTools.copy("azure-pipelines-cd.yaml", answers);
    }
}

/**
 * Transform a string into a camelcase string
 * @param {*} str String to convert into camelcase
 */
function generateSafeName(str) {
    return str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');
}