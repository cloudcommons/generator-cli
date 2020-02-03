var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');
var config = require('../../common/config');
var resources = require('../../common/resources');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.configName = "azure-sql";
  }

  initializing() {
  }

  async prompting() {
    var userQuestions = questions(this);
    this.answers = await this.prompt(userQuestions);
    resources.push("azurerm_sql_server", `azurerm_sql_server.${this.answers.serverName}`);
  }

  paths() {
  }

  configuring() {
    if (this.answers.features.includes('database')) {
      this.composeWith(require.resolve('../azure-sql-database'), {
        arguments: [`azurerm_sql_server.${this.answers.serverName}.0`, this.answers.databaseName]
      });
    }
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
  answers.serverAdminPassword = null;
  return answers;
}
