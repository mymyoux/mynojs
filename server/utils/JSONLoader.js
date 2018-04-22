import fs from "fs";
import path from "path";
export class JSONLoader
{
    static asJavascriptFile(path)
    {
        return new Promise((resolve, reject)=>
        {
            if(!fs.existsSync(path))
            {
                return reject(path+" doesn't exist");
            }
            let data = "return "+fs.readFileSync(path, 'utf8');
            try{
                let result = new Function(data);
                resolve(result());
            }catch(error)
            {
                reject(error);
            }
        });
    }
    static asJSONFile(path)
    {
        return new Promise((resolve, reject)=>
        {
            if(!fs.existsSync(path))
            {
                return reject(path+" doesn't exist");
            }
            let data = fs.readFileSync(path, 'utf8');
            try{
                let result = JSON.parse(data);
                resolve(result);
            }catch(error)
            {
                reject(error);
            }
        });
    }
}