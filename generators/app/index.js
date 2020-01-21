var Generator = require('yeoman-generator');
var questions = require('./questions');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
    }

    async prompting() {
        var userQuestions = questions(this);
        this.answers = await this.prompt(userQuestions);
    }

    paths() {
    }

    configuring() {
        this.composeWith(require.resolve(this.answers.subGenerator));
    }

    default() {
    }

    writing() {
    }

    conflicts() {
    }

    install() {
    }

    end() {
    }
};