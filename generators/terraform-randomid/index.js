const TerraformGenerator = require('../../core/TerraformGenerator');
const getQuestions = require('./questions');
const options = require('./options');
const writer = require('./writer');

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
    writer(this.terraform, this.fsTools, this.answers);
  }

  conflicts() {
  }

  install() {
  }

  end() {
  }
};


// var Generator = require('yeoman-generator');
// var writer = require('./writer');

// module.exports = class extends Generator {

//   constructor(args, opts) {
//     super(args, opts);
//   }

//   initializing() {
//   }

//   prompting() {
//   }

//   paths() {
//   }

//   configuring() {
//   }

//   default() {
//   }

//   writing() {
//     writer(this);
//   }

//   conflicts() {
//   }

//   install() {
//   }

//   end() {
//   }
// };