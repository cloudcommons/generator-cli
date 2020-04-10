const path = require('path');
const fs = require('fs-extra');
const terraformAssert = require('@cloudcommons/terraform-assert');

module.exports = class {

    constructor(spawn = null, log = null) {
        this.spawn = spawn ? spawn : require('child_process').spawnSync;
        this.log = log ? log : console.log;
    }

    /**
    * Spawns a terraform command
    * @param {*} args
    */
    terraform(args) {
        var rgs = this.spawn('terraform', args, {
            stdio: ['ignore', 'pipe', process.stderr]
        });

        if (rgs.output === null) throw "No response from terraform. Is terraform installed??";
        var output = rgs.output.toString().trim();
        return output.substring(1, output.length - 2);
    }

    /**
     * Initialises the current terraform folder
     * @param {*} log 
     * @param {*} spawnCommandSync 
     */
    init() {
        try {
            this.spawn('terraform', ['init']);
        }
        catch (e) {
            this.log("Error executing terraform init. Is terraform installed? ", e);
        }
    }

    /**
     * Runs a terraform plan and returns it in JSON format 
     * @param {*} plan 
     */
    getPlan(plan = 'plan.tfplan') {
        this.terraform(['plan', `-out=${plan}`]);
        var jsonString = this.terraform(['show', '-json', plan]);
        var json = JSON.parse(jsonString);
        return json;
    }

    getGeneratorPlan(done) {
        this.init();
        var planJson = this.getPlan();
        var plan = terraformAssert(planJson);
        done();
        return plan;
    }

    /**
     * Initialises a folder to execute subgenerators
     * @param {*} dir 
     */
    initialiseDir(dir, terraformVersion = "0.12.20") {
        fs.copySync(path.join(__dirname, `templates/${terraformVersion}`), dir);
    }
}