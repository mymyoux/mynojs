import { Configuration } from '../../common/env/Configuration';
import colors from "colors";
const fs = require('fs');
const path = require('path');
export class ConfigurationLoader {
    boot() {
        return new Promise((resolve, reject)=>
    {

        try{
            let localPath = app_path('env.json');
            if(!fs.existsSync(localPath))
            {
                console.log(colors.red("env.json not found"));
                reject();
            }
            let config = JSON.parse(fs.readFileSync(localPath, 'utf8'));
            let corePath = path.join(__dirname,'../../config');
            fs.readdirSync(corePath).filter(file => {
                return path.extname(file) == ".json";
            }).forEach((file) => {
                this.mergeWithDefaultOptions(file.substring(0, file.length - path.extname(file).length), config, JSON.parse(fs.readFileSync(path.join(corePath, file), 'utf8')));
            });
            let globalConfigPath = storage_path("config.json");
            let globalConfig = fs.existsSync(globalConfigPath)?JSON.parse(fs.readFileSync(globalConfigPath, 'utf8')):{};
            let globalPath = config_path();
            fs.readdirSync(globalPath).filter(file => {
                return path.extname(file) == ".json";
            }).forEach((file) => {
                this.mergeWithDefaultOptions(file.substring(0, file.length - path.extname(file).length), config, JSON.parse(fs.readFileSync(path.join(globalPath, file), 'utf8')));
            });
            this.mergeWithDefaultOptions(null, config, globalConfig);
            Configuration.readExternal(config);
            console.log(config);
            resolve();
        }catch(error)
        {
            console.log(error);
            reject();
        }
    });
    }
    mergeWithDefaultOptions(name, config, default_options) {
        if (name) {
            if (config[name] == undefined) {
                config[name] = {};
            }
            config = config[name];
        }
        for (var p in default_options) {
            if (config[p] == undefined) {
                config[p] = default_options[p];
                continue;
            }
            if (typeof default_options[p] != typeof config[p]) {
                //overwrite current options
                config[p] = default_options[p];
                continue;
            }
            if (typeof default_options[p] == "object") {
                config[p] = this.mergeWithDefaultOptions(null, config[p], default_options[p]);
            }
        }
        return config;
    }
}
export var configurationLoader = new ConfigurationLoader();
