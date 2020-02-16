// var Generator = require('yeoman-generator');
var TerraformGenerator = require('../../core/TerraformGenerator');
var writer = require('./writer');
var getQuestions = require('./questions');
const options = require('./options');

module.exports = class extends TerraformGenerator {

  constructor(args, opts) {
    super(args, opts, "azure-aks-app", "azure-aks-app");
    super.addOptions(options);
  }

  initializing() {
  }

  async prompting() {
    var questions = getQuestions(this, this.az, this.terraform, this.configManager);
    this.answers = this.mergeOptions(options, await this.prompt(questions));
    this.addResource(this.answers.name);
  }

  paths() {
  }

  configuring() {
  }

  default() {
  }

  writing() {
    writer(this.terraform, this.fsTools, this.answers);
  }

  conflicts() {
  }

  install() {
  }

  end() {
    this.save(cleanupSecrets(this.answers));
  }
};

function cleanupSecrets(answers) {
  answers.dockerRepoPassword = null;

  return answers;
}