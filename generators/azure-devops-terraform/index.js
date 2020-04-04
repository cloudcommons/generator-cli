// var Generator = require('yeoman-generator');
var TerraformGenerator = require('../../core/TerraformGenerator');
var writer = require('./writer');
var getQuestions = require('./questions');
const options = require('./options');

module.exports = class extends TerraformGenerator {

  constructor(args, opts) {
    super(args, opts, "azure-devops-terraform");
    super.addOptions(options);
  }

  initializing() {
  }

  async prompting() {
    var questions = getQuestions(this, this.terraform, this.configManager);
    this.answers = this.mergeOptions(options, await this.prompt(questions));
  }

  paths() {
  }

  configuring() {
  }

  default() {
  }

  writing() {
    writer(this.fsTools, this.answers);
  }

  conflicts() {
  }

  install() {
  }

  end() {
    this.save(cleanupSecrets(this.answers));
    this.log("Completed! Please note this template require the following Azure DevOps extensions:");
    this.log("Terraform Buld & Release Tasks, by Charles Zipp: https://marketplace.visualstudio.com/items?itemName=charleszipp.azure-pipelines-tasks-terraform");
    this.log("Replace toeksn task, by Guillaume Rouchon: https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens");
    this.log("Ensure them are installed before running the pipeline!");
  }
};

function cleanupSecrets(answers) {
  return answers;
}