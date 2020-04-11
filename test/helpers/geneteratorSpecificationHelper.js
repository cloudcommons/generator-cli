const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const rimraf = require('rimraf');
const helpers = require('yeoman-test');
const TerraformHelper = require('./terraformHelper');
const terraform = new TerraformHelper();
const basePath = path.join(__dirname, '../../generators');
const terraformAssert = require('@cloudcommons/terraform-assert');

/**
 * Given a generator specification, executes a chain of promises invoking all the generators, one by one.
 * If the config
 */
module.exports = function (spec, done) {
    // Creates a temporary working folder for all sub-generators
    var tmpdir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'));
    rimraf.sync(tmpdir);

    if (!fs.existsSync(tmpdir)) {
        fs.mkdirSync(tmpdir);
    }
    // Get all generators to execute
    var generators = Object.keys(spec.generators);
    // Execute the promise chain
    executeGenerators(tmpdir, spec, generators, done);
}

/**
 * Iterative function executing all the generators in the same folder, one by one. 
 * Once all generators have been executed, checks if terraform plan should be executed.
 * Finally, notifies the upstream process that everything is ready by calling to "done"
 * @param {*} dir 
 * @param {*} spec 
 * @param {*} generators 
 * @param {*} done 
 */
function executeGenerators(dir, spec, generators, done) {
    const nextGenerator = generators.shift();
    if (nextGenerator) {
        return executeGenerator(dir, nextGenerator, spec.generators[nextGenerator]).then(() => {
            executeGenerators(dir, spec, generators, done);
        }).catch(e => {
            console.log(e);
        });
    }
    else {
        return new Promise((resolve, reject) => {
            try {
                var plan = generatorsCompleted(spec, dir);
                done(plan);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}
/**
 * Yeoman generator invokation in a promise
 * @param {*} dir 
 * @param {*} name 
 * @param {*} generatorSpec 
 */
function executeGenerator(dir, name, generatorSpec) {
    return new Promise((resolve, reject) => {
        console.debug(`Executing generator ${name}`);
        try {
            helpers.run(path.join(basePath, name))
                .cd(dir)
                .withPrompts(generatorSpec.prompts)
                .once('end', () => {
                    console.debug(`Generator ${name} execution completed.`);
                    resolve();
                });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

/**
 * Final stage of the chain, where we check if we should perform terraform init and terraform plan.
 * @param {*} spec 
 * @param {*} dir 
 */
function generatorsCompleted(spec, dir) {
    console.debug("Generators completed");
    if (spec && spec.config && spec.config.terraform) {
        cfg = spec.config.terraform;
        if (cfg.init) {
            console.debug("terraform init");
            terraform.init(dir);
        }
        if (cfg.plan) {
            console.debug("terraform plan")
            var planJson = terraform.getPlan(dir);
            return terraformAssert(planJson);
        }
    }

    return null;
}