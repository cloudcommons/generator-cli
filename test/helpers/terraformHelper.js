const debug = require('debug')('cloudcommons/generator-cli:terraform');

module.exports = class {

    constructor(spawn = null, log = null) {
        this.spawn = spawn ? spawn : require('child_process').spawnSync;
        this.log = log ? log : debug;
    }

    /**
    * Spawns a terraform command
    * @param {*} args
    */
    terraform(args, dir = null) {
        try {
            var opts = {
                stdio: ['ignore', 'pipe', process.stderr]
            };
            if (dir) opts.cwd = dir;
            this.log(`${dir ? dir + '/' : ''}terraform ${args ? args.join(' ') : ""}`);
            var rgs = this.spawn('terraform', args, opts);
            if (rgs.output === null) throw "No response from terraform. Is terraform installed??";
            var output = rgs.output.toString().trim();
            output = output.substring(1, output.length - 2);
            this.log(output);
            if (rgs.status !== 0) {
                throw new Error(output);
            }
            return output;
        } catch (e) {
            this.log("Error executing terraform init. Is terraform installed? ", e);
            throw e;
        }
    }

    /**
     * Initialises the current terraform folder
     * @param {*} spawnCommandSync 
     */
    init(dir = null) {
        this.terraform(['init'], dir);
    }

    validate(dir = null) {
        this.terraform(['validate'], dir);
    }

    /**
     * Runs a terraform plan and returns it in JSON format 
     * @param {*} plan 
     */
    getPlan(dir = null, refresh = false) {
        const planName = 'plan.tfplan';
        this.terraform(['plan', `-out=${planName}`, '-input=false', `-refresh=${refresh}`], dir);
        var jsonString = this.terraform(['show', '-json', planName], dir);
        var json = JSON.parse(jsonString);
        return json;
    }
}