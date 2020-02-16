// var Generator = require('yeoman-generator');
var TerraformGenerator = require('../../core/TerraformGenerator');
var writer = require('./writer');
var getQuestions = require('./questions');
const options = require('./options');

module.exports = class extends TerraformGenerator {

  constructor(args, opts) {
    super(args, opts, "azure-aks-helm", "azure-aks-helm");
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
    var ip = null;
    if (this.answers.features.includes("ingress")) {
      this.composeWith(require.resolve('../azure-aks-ingress'), {
        name: this.answers.name,
        inamespace: this.answers.name,
        aksManagedResourceGroup: this.answers.aksResourceGroup,
        dns: this.answers.recordName
      });
      ip = `azurerm_public_ip.${this.answers.name}-ingress.id`
    }
    
    if (this.answers.features.includes("dns")) {
      ip = ip ? ip : this.answers.privateLoadBalancerIp;
      this.composeWith(require.resolve('../azure-dns-record'), {
        name: this.answers.name,
        recordName: this.answers.recordName,
        type: 'a',
        record: ip
      });
    }

    if(this.answers.features.includes("privateRegistry")) {
      this.composeWith(require.resolve('../kubernetes-secret-docker'), {
        name: this.answers.name,
        kNamespace: `local.namespace`
      });      
    }
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