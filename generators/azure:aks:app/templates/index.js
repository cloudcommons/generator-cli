var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.option("azure");
  }

  initializing() {
    this.log('Welcome to CloudCommons')
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
    this.log("All set! Please validate your terraform script with 'terraform validate'");
  }
};