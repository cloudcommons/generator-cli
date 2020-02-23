module.exports = {
    copy: function (terraform, answers, file = "__init__.tf.json") {
        var backEnd = getBackend(answers);
        terraform.writeBackEnd(backEnd, file);
    }
}

function getBackend(answers) {
    return {
        "terraform": [{
            "required_version": answers.version,
            "backend": [{
                "local": {
                }
            }]
        }]
    }
}