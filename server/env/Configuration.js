import { Objects } from "../../common/utils/Objects";
import { Hardware } from  "../../common/env/Hardware";
import { root } from  "../../common/env/Root"; 
import {Configuration as BaseConfiguration} from  "../../common/env/Configuration";
import fs from  'fs';
import util from 'util';
import path from  'path';
import dotenv from  'dotenv';

export class Configuration  extends BaseConfiguration{
    static loadFileSync(file, prefix = false)
    {
        try {
            console.log('reading ' + file)
            let files = fs.readdirSync(path.dirname(file));
            console.log('PIK', path.dirname(file), files)
        } catch (err) {
            // An error occurred
            console.error(err);
        }
        console.log('loading '+file);
        let extension = path.extname(file);
        if(!extension)
        {
            extension = path.basename(file);
        }
        if(extension == '.json')
        {
            //json with fault tolerant
            let result = 'return '+fs.readFileSync(file, {encoding:'utf-8'});
            result = new Function(result);
            result = result();
            if(prefix)
            {
                this.merge(path.basename(file, extension), result);            
            }else
            {
                this.merge( result);
            }

        }else
        if(extension == '.env')
        {
            dotenv.config({ path: file })
            console.log('PROCESS_ENV', process.env.ENVIRONMENT)
        }else
        if(extension == '.js')
        {
            // console.log('REQUIRE', require, global.require);
            let result = typeof __non_webpack_require__ == 'undefined' ? require(file):__non_webpack_require__(file);
            if(prefix)
            {
                this.merge(path.basename(file, extension), result);            
            }else
            { 
                this.merge( result);
            }
        }
    }
    static loadFolderSync(folder, prefix = true)
    {
        let result = fs.readdirSync(folder);
        result.forEach((item)=>this.loadFileSync(path.join(folder,item), prefix));
    }
}
export const config = function(key, value)
{
    if(value != undefined)
    {
        return Configuration.set(key, value);
    }
    return Configuration.get(key);
}
//add Configuration methods to config
for(let key of Object.getOwnPropertyNames(Configuration))
{
    if(typeof Configuration[key] == "function")
    {
        config[key] = Configuration[key];
    }
}
root.config = config;