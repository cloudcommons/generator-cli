// var Generator = require('yeoman-generator');
var TerraformGenerator = require('../../core/TerraformGenerator');
var getQuestions = require('./questions');
const options = require('./options');

module.exports = class extends TerraformGenerator {

    constructor(args, opts) {
        super(args, opts);
        super.addOptions(options);
    }

    initializing() {
    }

    async prompting() {
        var questions = getQuestions(this, this.az, this.terraform, this.configManager);
        this.answers = this.mergeOptions(options, await this.prompt(questions));
    }

    paths() {
    }

    configuring() {
        if (!Array.isArray(this.answers.subGenerators)) {
            this.answers.subGenerators = [this.answers.subGenerators];
        }

        this.answers.subGenerators.forEach(subGenerator => this.composeWith(require.resolve(subGenerator)));

        if (this.terraformInitialised || this.answers.subGenerators.includes('../terraform-import')) {
            return;
        }

        if (!this.answers.subGenerators.includes("../terraform")) {
            this.composeWith(require.resolve('../terraform'));
        }
    }

    default() {
    }

    writing() {
    }

    conflicts() {
    }

    install() {
        if (this.answers.subGenerators.includes('../terraform-import')) {
            return;
        }

        this.terraform.init();
    }

    end() {
    }
};