import { Configuration } from '../../common/env/Configuration';
import colors from "colors";
import { JSONLoader } from '../utils/JSONLoader';
const fs = require('fs');
const path = require('path');
export class ConfigurationLoader {
    boot() {
        return new Promise(async (resolve, reject)=>
    {

        try{
            let localPath = app_path('env.json');
            if(!fs.existsSync(localPath))
            {
                console.log(colors.red("env.json not found"));
                reject();
            }
            let config = {}
            //default config
            let corePath = path.join(__dirname,'../../config');
            await fs.readdirSync(corePath).filter(file => {
                return path.extname(file) == ".json";
            }).forEach(async (file) => {
                let data =  await JSONLoader.asJavascriptFile(path.join(corePath, file));
                this.mergeWithDefaultOptions(file.substring(0, file.length - path.extname(file).length), config, data);
            });

            let globalConfigPath = storage_path("config.json");
            let globalConfig = fs.existsSync(globalConfigPath)?await JSONLoader.asJavascriptFile(globalConfigPath):{};
            this.mergeWithDefaultOptions(null, config, globalConfig);
            
            let globalPath = config_path();
            await fs.readdirSync(globalPath).filter(file => {
                return path.extname(file) == ".json";
            }).forEach(async (file) => {
                let data =  await JSONLoader.asJavascriptFile(path.join(globalPath, file));
                this.mergeWithDefaultOptions(file.substring(0, file.length - path.extname(file).length), config, data);
            });

            
            this.mergeWithDefaultOptions(null, config,await JSONLoader.asJavascriptFile(localPath));


            Configuration.readExternal(config);
            console.log("CONFIG",config);
            resolve();
        }catch(error)
        {
            console.log(error);
            reject();
        }
    });
    }
    loadFileData(path)
    {
        let data = "return "+fs.readFileSync(path, 'utf8');
        let result = new Function(data);
        return result();
    }
    mergeWithDefaultOptions(name, config, default_options) {
        if (name) {
            if (config[name] == undefined) {
                config[name] = {};
            }
            config = config[name];
        }
        let keys = Object.keys(default_options);
        for(let key of keys)
        {
            if(~key.indexOf('.'))
            {
                let parts = key.split('.');
                let k = parts.shift();
                if(!default_options[k])
                {
                    default_options[k] = {};
                }
                default_options[k][parts.join('.')] = default_options[key];
                delete default_options[key];
            }
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
            }else{
                config[p] = default_options[p];
            }
        }
        return config;
    }
}
export var configurationLoader = new ConfigurationLoader();
