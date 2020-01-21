module.exports = function (generator, key, defaultValue) {
    const answers = generator.config.get(generator.configName);
    return answers && answers[key] ? answers[key] : defaultValue;
}