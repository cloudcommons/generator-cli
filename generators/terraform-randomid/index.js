var Generator = require('yeoman-generator');
var writer = require('./writer');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
  }

  prompting() {
  }

  paths() {
  }

  configuring() {
  }

  default() {
  }

  writing() {
    writer(this);
  }

  conflicts() {
  }

  install() {
  }

  end() {
  }
};