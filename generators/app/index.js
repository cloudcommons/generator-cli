var Generator = require('yeoman-generator');
var questions = require('./questions');
var terraform = require('../../common/terraform');
var resources = require('../../common/resources');
module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        resources.load(this);
    }

    async prompting() {
        var userQuestions = questions(this);
        this.answers = await this.prompt(userQuestions);
    }

    paths() {
    }

    configuring() {
        if (!Array.isArray(this.answers.subGenerators)) {
            this.answers.subGenerators = [this.answers.subGenerators];
        }

        this.answers.subGenerators.forEach(subGenerator => this.composeWith(require.resolve(subGenerator)));

        if (this.answers.subGenerators.includes('../terraform-import')) {
            return;
        }

        if (!this.answers.subGenerators.includes("../terraform")) {
            this.composeWith(require.resolve('../terraform'));
        }

        if (!this.answers.subGenerators.includes('../terraform-randomid')) {
            this.composeWith(require.resolve('../terraform-randomid'));
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

        terraform.init(this.log, this.spawnCommandSync);
    }

    end() {
    }
};