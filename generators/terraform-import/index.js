var Generator = require('yeoman-generator');
var questions = require('./questions');
var terraform = require('../../common/terraform');

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
  }

  default() {
  }

  writing() {
    this.log(terraform.import(this, this.answers.resourceName, this.answers.azureId));
  }

  conflicts() {
  }

  install() {
  }

  end() {
  }
};