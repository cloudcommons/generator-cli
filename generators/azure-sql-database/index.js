var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');
var config = require('../../common/config');
var resources = require('../../common/resources');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.configName = "azure-sql-database";
    this.answers = {};
    this.argument("server", {
      type: String,
      required: false
    });
    this.argument("databaseName", {
      type: String,
      required: false
    })
  }

  initializing() {
  }

  async prompting() {
    var userQuestions = questions(this);
    this.answers = await this.prompt(userQuestions);
    resources.push("azurerm_sql_database", `azurerm_sql_database.${this.answers.databaseName}`);
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
    config.save(this);
  }  
};

function cleanupSecrets(answers) {
  return answers;
}
