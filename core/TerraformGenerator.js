var Generator = require('yeoman-generator');
var Config = require('./Config');
var Resources = require('./Resources')
var Az = require('./Az');
var Terraform = require('./Terraform');
var FsTools = class {
    constructor(generator) {
        this.generator = generator;
    }

    /**
     * Copies a file from the source path to the exact same location in destination
     * @param {*} source Source path
     * @param {*} parameters Object with parameters to replace
     */
    copy(source, parameters) {
        this.generator.fs.copyTpl(
            this.generator.templatePath(source),
            this.generator.destinationPath(source),
            parameters
        );
    }

    /**
     * Copies a file from the source to a given destination path
     * @param {*} source Source path
     * @param {*} destination Target path
     * @param {*} parameters Object with parameters to replace
     */
    copyTo(source, destination, parameters) {
        this.generator.fs.copyTpl(
            this.generator.templatePath(source),
            this.generator.destinationPath(destination),
            parameters
        );
    }
}

module.exports = class extends Generator {
    constructor(args, opts, name, resourceType) {
        super(args, opts);
        this.configName = name;
        this.resourceType = resourceType;        
        this.az = new Az(this.spawnCommandSync, this.log); 
        this.terraform = new Terraform(this.fs, this.spawnCommandSync, this.log);
        this.configManager = new Config(this, this.terraform);
        this.resources = new Resources(this.configManager, this.az, this.terraform);
        this.fsTools = new FsTools(this);
        this.terraformInitialised = this.configManager.getGlobal("terraform") !== undefined;
    };

    addResource(name) {
        this.resources.push(this.resourceType, `${this.resourceType}.${name}`);
    }

    save(answers) {
        this.configManager.set(this.configName, answers);
        this.resources.save();
        this.config.save();
    }

    saveGlobal(answers) {
        this.configManager.setGlobal(this.configName, answers);
        this.resources.save();
        this.config.save();
    }    

    addOptions(options) {
        for (const [option, config] of Object.entries(options)) {
            switch (config.type) {
                case "String":
                    config.type = String;
                    break;
                case "Number":
                    config.type = Number;
                    break;
                case "Boolean":
                    config.type = Boolean;
                    break;
                default: config.type = String;
                    break;
            }

            this.option(option, config);
        }
    }

    mergeOptions(options, answers) {
        for (const [option] of Object.entries(options)) {
            if (this.options[option] === undefined) continue;
            answers[option] = this.options[option];
        }

        return answers;
    }
}