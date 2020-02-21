
const TerraformGenerator = require('../../core/TerraformGenerator');
const getQuestions = require('./questions');
const options = require('./options');
const packageJson = require('../../package');

module.exports = class extends TerraformGenerator {

  constructor(args, opts) {
    super(args, opts);
    super.addOptions(options);
  }

  initializing() {
  }

  async prompting() {
    var questions = getQuestions(this.az, this.resources);
    this.answers = this.mergeOptions(options, await this.prompt(questions));
  }

  paths() {
  }

  configuring() {
  }

  default() {
  }

  writing() {
    this.log(terraform.import(this, this.answers.resourceName, this.answers.azureId));
  }

  conflicts() {
  }

  install() {
  }

  end() {
    this.configManager.setGlobal("version", packageJson.version);
    this.save(cleanupSecrets(this.answers));
  }
};

function cleanupSecrets(answers) {
  return answers;
}