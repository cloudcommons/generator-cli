// var Generator = require('yeoman-generator');
var TerraformGenerator = require('../../core/TerraformGenerator');
var writer = require('./writer');
var getQuestions = require('./questions');
const options = require('./options');

module.exports = class extends TerraformGenerator {

  constructor(args, opts) {
    super(args, opts, "azure-sql", "azurerm_sql_server");
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
    if (this.answers.features.includes('database')) {
      this.composeWith(require.resolve('../azure-sql-database'), {
        databaseName: this.answers.databaseName,
        databaseServer: `azurerm_sql_server.${this.answers.name}.0`,
        databaseServerResourceGroup: this.answers.resourceGroup
      });
    }
  }

  default() {
  }

  writing() {
    writer(this.terraform, this.fsTools, this.answers);
    this.addResource(this.answers.name);
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
  answers.serverAdminPassword = null;
  return answers;
}
