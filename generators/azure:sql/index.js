var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');


function cleanupSecrets(answers) {
  answers.serverAdminPassword = null;
}

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.configName = "azure:sql";
  }

  initializing() {
  }

  async prompting() {
    var userQuestions = questions(this);
    this.answers = await this.prompt(userQuestions);
  }

  paths() {
    this.log("Writing to ", this.destinationRoot());
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
    this.log("Initialising Terraform...")
    try {
      this.spawnCommandSync('terraform', ['init']);
    }
    catch(e) {
      this.log("Error executing terraform init. Is terraform installed? ", e);
    } 
  }

  end() {
    cleanupSecrets(this.answers);   // Secrets are not stored in the .yo-rc file, as it is stored in clear
    this.config.set(this.configName, this.answers);
    this.config.save();
    this.log("All set! Please validate your terraform script with 'terraform validate'");
  }  
};