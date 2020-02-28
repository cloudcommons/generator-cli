var generators = require('./choices/generators');

module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "list",
        name: "subGenerators",
        message: "What do you want to create?",
        choices: generators
    });

    return questions;
}