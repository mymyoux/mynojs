import electron from "../../../../common/electron/Electron";
import { Hardware } from "../../../../common/env/Hardware";
import { Promise } from "bluebird";

const isElectron = Hardware.isElectron();
export const file_exists = {
    getMessage(field, args, error) {
        if(error && error.path)
            return error.path+" doesn\'t exist"
        return field+" path doesn\'t exist"
    },
    validate(value, args) {
        if(!isElectron)
            return true;
        if(typeof value == "object" && value)
        {
            if(value.path == value.name)
                return true;
        }
        let fs = electron.remote.require("fs");
        return new Promise((resolve, reject)=>
        {
            if(typeof value == "object" && value)
            {
                if(value.path)
                {
                    value = value.path;
                }
            }
            fs.stat(value, (error, value)=>
            {
                debugger;
                if(error)
                {
                    resolve({valid:false,data:error});
                }else
                {
                    resolve({valid:true,data:value});
                }
            });
        })
    }
  };
  