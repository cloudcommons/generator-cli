var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');
var config = require('../../common/config');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.configName = "azure-aks-app";
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
    if (this.answers.features.includes('azure-network')) {
      this.log(`IMPORTANT: When using Azure CNI, AKS Service Principal '${this.answers.clientId}' should have 'Network Contributor' permissions at '${this.answers.aksResourceGroup}' in order to Ensure Load Balancers.`);
      this.log(`If you are experiencing issues with Load Balancers, please check with your Azure Administrator the Service Principal has the appropiate permissions.`);
      this.log("More information: https://github.com/Azure/AKS/issues/357#issuecomment-394583518")
    }

    config.set(this, this.configName, cleanupSecrets(this.answers));
    config.save(this);
  }
};

function cleanupSecrets(answers) {
  answers.dockerRepoPassword = null;

  return answers;
}