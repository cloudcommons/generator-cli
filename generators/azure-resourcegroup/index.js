var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');
var config = require('../../common/config');
var resources = require('../../common/resources');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.configName = "azure-resourcegroup";    
  }

  initializing() {
    resources.load(this);
  }

  async prompting() {
    var userQuestions = questions(this);
    this.answers = await this.prompt(userQuestions);
    resources.push("azurerm_resource_group", `azurerm_resource_group.${this.answers.name}`);
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
    resources.save(this);
    config.save(this);
  }  
};

function cleanupSecrets(answers) {
  return answers;
}
