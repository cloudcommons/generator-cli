var TerraformGenerator = require('../../core/TerraformGenerator');
var getQuestions = require('./questions');
const options = require('./options');

module.exports = class extends TerraformGenerator {

  constructor(args, opts) {
    super(args, opts);
    super.addOptions(options);
  }

  initializing() {
    try {
      this.provider = require(this.destinationPath('__init__.tf.json')).terraform[0].backend[0];
    } catch (e) {
      this.provider = undefined;
      this.log("Not able to find provider");
    }
  }

  async prompting() {
    var questions = getQuestions(this, this.az, this.terraform, this.configManager);    
    this.answers = this.mergeOptions(options, await this.prompt(questions));    
    this.answers.isRemote = this.provider && this.provider.remote
    this.answers.token = this.answers.isRemote && this.provider.remote.token ? this.provider.remote.token : this.answers.token;
  }

  paths() {
  }

  configuring() {
  }

  default() {
  }

  writing() {
  }

  conflicts() {
  }

  install() {
    this.log(`Creating workspace '${this.answers.name}'`)
    this.terraform.createWorkspace(this.answers.name);
    if (this.answers.isRemote) {
      var provider =  this.provider.remote;
      var workspace = `${provider.workspaces.prefix}${this.answers.name}`;
      this.log(`Creating remote variables`);
      this.terraform.createVariables(this.destinationPath('variables.tf.json'), this.destinationPath('terraform.tfvars.json'), provider.organization, workspace, this.answers.token);
      this.log(`Creating remote AzureRM environment variables`);
      this.terraform.createAzureRmVariables(provider.organization, workspace, this.answers.token);
      this.log(`Environment ready to use`);
    }
  }

  end() {
  }
};
