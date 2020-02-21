// var Generator = require('yeoman-generator');
var TerraformGenerator = require('../../core/TerraformGenerator');
var writer = require('./writer');
var getQuestions = require('./questions');
const options = require('./options');

module.exports = class extends TerraformGenerator {

  constructor(args, opts) {
    super(args, opts, "azure-aks", "azurerm_kubernetes_cluster");
    super.addOptions(options);
  }

  initializing() {
  }

  async prompting() {
    var questions = getQuestions(this, this.az, this.terraform, this.configManager, this.resources);
    this.answers = this.mergeOptions(options, await this.prompt(questions));
  }

  paths() {
  }

  configuring() {
  }

  default() {
  }

  writing() {
    writer(this.terraform, this.fsTools, this.answers, this.options);
    this.addResource(`${this.answers.name}`);
  }

  conflicts() {
  }

  install() {
  }

  end() {
    if (this.answers.features.includes('azure-network')) {
      this.log(`IMPORTANT: When using Azure CNI, AKS Service Principal '${this.answers.clientId}' should have 'Network Contributor' permissions at '${this.answers.aksResourceGroup}' in order to Ensure Load Balancers.`);
      this.log(`If you are experiencing issues with Load Balancers, please check with your Azure Administrator the Service Principal has the appropiate permissions.`);
      this.log("More information: https://github.com/Azure/AKS/issues/357#issuecomment-394583518")
    }
    this.save(cleanupSecrets(this.answers));
  }
};

function cleanupSecrets(answers) {
  answers.clientSecret = null;
  return answers;
}