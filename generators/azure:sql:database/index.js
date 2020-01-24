var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.configName = "azure:sql:database";
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
    cleanupSecrets(this.answers);   // Secrets are not stored in the .yo-rc file, as they are stored in clear
    this.config.set(this.configName, this.answers);
    this.config.save();
  }  
};

function cleanupSecrets(answers) {
}
