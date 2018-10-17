const { Configuration } = require('../env/Configuration');
const fs = require('fs');
const path = require('path');
const paths = require('../core/paths')
class ConfigurationLoader {
    boot() {
        return new Promise(async (resolve, reject)=>
    {

        try{

            Configuration.loadFileSync(base_path('.env'));
            Configuration.loadFileSync(base_path('storage/config.json'))
            Configuration.loadFolderSync(source_path('myno/config'));
            Configuration.loadFolderSync(config_path());
            resolve(Configuration);
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
var configurationLoader = new ConfigurationLoader();
module.exports = 
{
    ConfigurationLoader, configurationLoader
}
