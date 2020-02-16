module.exports = {
    copy: function (terraform, answers) {
        var output = {
            output: {
            }
        }

        terraform.writeOutput(output);
    }
}

