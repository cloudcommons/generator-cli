module.exports = {
    copy: function (terraform, answers) {

        var output = {
            output: {
                HELM_METADATA: {
                    description: "Block status of the deployed release",
                    value: terraform.toVariable(`helm_release.${answers.name}.metadata`)
                }
            }
        }

        terraform.writeOutput(output);
    }
}                                