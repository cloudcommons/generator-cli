
const TerraformGenerator = require('../../core/TerraformGenerator');
const writer = require('./writer');
const getQuestions = require('./questions');
const options = require('./options');
const packageJson = require('../../package');

module.exports = class extends TerraformGenerator {

  constructor(args, opts) {
    super(args, opts, "terraform", "terraform");
    super.addOptions(options);
  }

  initializing() {
  }

  async prompting() {
    var questions = getQuestions(this.az, this.configManager);
    this.answers = this.mergeOptions(options, await this.prompt(questions));
  }

  paths() {
  }

  configuring() {
    this.composeWith(require.resolve('../terraform-randomid'));
  }

  default() {
  }

  writing() {
    writer(this.terraform, this.fsTools, this.answers);
  }

  conflicts() {
  }

  install() {
    if (this.answers.backendType === "remote" && !(process.env.test === "true")) {
      this.terraform.init();
      if (this.answers.createRemoteVariables === true) {
        this.composeWith(require.resolve('../terraform-workspace'), {
          name: "dev",
          token: this.answers.token
        });
      }
    }
  }

  end() {
    this.configManager.setGlobal("version", packageJson.version);
    this.saveGlobal(cleanupSecrets(this.answers));
  }
};

function cleanupSecrets(answers) {
  return answers;
}