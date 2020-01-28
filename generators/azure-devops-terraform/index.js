var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');
var config = require('../../common/config');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.configName = "azure-devops-terraform";
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
    writer(this, this.answers);
  }

  conflicts() {
  }

  install() {
  }

  end() {
    config.set(this, this.configName, cleanupSecrets(this.answers));
    config.save(this);

    this.log("Completed! Please dont forget to:");
    this.log(`1) Configure your YAML pipelines in Azure DevOps`);
    this.log(`2) Create environment the environment variables for the Azure back-end`);
    this.log(`3) A Service Connection named ${this.answers.subscription} exists in your Azure DevOps`);
  }
};

function cleanupSecrets(answers) {
  return answers;
}