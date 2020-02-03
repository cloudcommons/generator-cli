var Generator = require('yeoman-generator');
var writer = require('./writer');
var questions = require('./questions');
var config = require('../../common/config');
var packageJson = require('../../package');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.configName = "terraform";
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
    config.set(this, this.configName, cleanupSecrets(this.answers));
    config.setGlobal(this, "version", packageJson.version);
    config.save(this);
  }
};

function cleanupSecrets(answers) {
  return answers;
}