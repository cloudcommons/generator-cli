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
const log = require('debug')('generator-cli:genspec');

/**
 * Given a generator specification, executes a chain of promises invoking all the generators, one by one.
 * If the config
 */
module.exports = function (spec, done, reject) {
    // Creates a temporary working folder for all sub-generators
    log('Creating temporary directory');
    var tmpdir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'));
    log(`Temporary directory will be ${tmpdir}`);
    rimraf.sync(tmpdir);
    log(`Temporary dir rmrf (${tmpdir})`);
    if (!fs.existsSync(tmpdir)) {
        log(`Temporary dir created (${tmpdir} )`);
        fs.mkdirSync(tmpdir);
    }
    // Get all generators to execute
    var generators = Object.keys(spec.generators);
    log(`Executing generators ${generators}`)
    // Execute the promise chain
    executeGenerators(tmpdir, spec, generators, done, reject).catch(e => {
        log(e);
        reject(e);
    });
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
    log(`executeGenerators: ${dir}, ${spec}, ${generators}`);
    const nextGenerator = generators.shift();
    if (nextGenerator) {
        return executeGenerator(dir, nextGenerator, spec.generators[nextGenerator]).then(() => {
            executeGenerators(dir, spec, generators, done).catch(e => {
                log(e);
                done(e);
            });
        }).catch(e => {
            log(e);
            done(e);
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
        log(`Executing generator ${name}`);
        try {
            helpers.run(path.join(basePath, name))
                .cd(dir)
                .withPrompts(generatorSpec.prompts)
                .once('end', () => {
                    log(`Generator ${name} execution completed.`);
                    resolve();
                });
        } catch (e) {
            log(e);
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
    log("All generators have completed. Finishing generator specification execution...");
    if (spec && spec.config && spec.config.terraform) {
        cfg = spec.config.terraform;
        if (cfg.init) {
            log('Initisalising terraform');
            terraform.init(dir);
            terraform.validate(dir);
        }
        if (cfg.plan) {
            log('Planning terraform');
            var planJson = terraform.getPlan(dir);
            log("Completed");
            return terraformAssert(planJson);
        }
    }

    log("Completed");
    return null;
}