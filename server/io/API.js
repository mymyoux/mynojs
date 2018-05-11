import { Objects } from "../../common/utils/Objects";
import { Strings } from "../../common/utils/Strings";
import path from "path";
import fs from "fs";
import colors from "colors";
import { Functions } from "../../common/utils/Functions";
export class API
{

    _path = null;
    _params = {};
    _user = null;
    _sender = null;
    _controllers = {};
    path(path)
    {
        this._path = path;
        return this;
    }
    user(user)
    {
        this._user = user;
        return this;
    }
    sender(sender)
    {
        this._sender = sender;
        return this;
    }
    async loadController(name) {
        if (this._controllers[name]) {
            return Promise.resolve(this._controllers[name]);
        }
        var parts = name.split("/");
        //var cls = global.requirejs('main/controllers' + name)[parts[parts.length - 1]];
        let className = Strings.Camel(parts[0]);
        let controllerPath = path.join(config('api.controllers'),className);
        let file = controllerPath+".js";
        if(!fs.existsSync(file))
        {
            console.log('API['+colors.red('error')+'] '+colors.red('path doesnt exist'));
            controllerPath = path.join(__dirname, "../controllers", className);
        }
        
        var cls = require(controllerPath)[className];//[parts[parts.length - 1]];
        this._controllers[name] = new cls();
        let boot;
        try{

            if(!this._controllers[name].boot)
            {
                boot = null;
            }else{
                boot =this._controllers[name].boot();
            }
        }catch(error)
        {
            boot = Promise.reject(boot);
        }
        if(!(boot instanceof Promise))
        {
            boot = Promise.resolve(boot);
        }
        var result = await boot.then(() => {
            return this._controllers[name];
        });
        return result;
    }
    params(params)
    {
        this._params = Objects.merge(this._params, params);
        return this;
    }

    execute()
    {
        console.log("API["+colors.red(this._path)+"]");
        console.log(colors.cyan("Parameters"));
        console.log(this._params);
        
        return new Promise(async (resolve, reject)=>
        {
            let path = this._path;
            var parts = path.split('/');
            var action = parts.pop();
            parts = parts.map(function (item) {
                return Strings.camel(item);// item.substring(0, 1).toUpperCase() + item.substring(1);
            });
            let user = this._user;
            var controller = parts.join('/');
            if (!this._controllers[controller]) {
                try {
                    var resultAPI = await this.loadController(controller);
                    // var cls = (<any>global).requirejs('myno/server/controllers/'+controller)[parts[parts.length-1]];
                    // this.apicontrollers[controller] = new cls();
                    // console.log('initializating '+ controller);
                    // var result = await this.apicontrollers[controller].run();
                    // console.log('initializated '+ controller);
                }
                catch (error) {
                    console.log(colors.red('API ERROR'));
                    if (error) {
                        console.error(error);
                    }
                    return reject({ lineNumber: error.lineNumber, fileName: error.fileName, message: 'no controller:' + controller }, true);
                }
            }
            if (typeof this._controllers[controller][action] != "function") {
                return reject({ lineNumber: 0, fileName: "main", message: 'no action:' + controller + '#' + action + '()' }, true);
            }
            try {
                let method = this._controllers[controller][action];
                if(!method.parameters)
                {
                    method.parameters = Functions.getParameters(method);
                }
                let parameters = method.parameters.map((item)=>
                {
                    if(item == "user")
                    {
                        return user;
                    }
                    if(item == "params")
                    {
                        return this._params;
                    }
                    if(item == "sender")
                    {
                        return this._sender;
                    }
                    return undefined;

                })

                var resultAPI = this._controllers[controller][action](...parameters);
            }
            catch (error) {
                return reject(error, true);
            }
            var promise;
            if (!(resultAPI instanceof Promise)) {
                promise = Promise.resolve(resultAPI);
            }
            else {
                promise = resultAPI;
            }
            return promise.then((data) => {
                if (data && typeof data == "object" && data.writeExternal) {
                    data = data.writeExternal(user);
                }
                console.log(colors.cyan("Result"));
                console.log(data);
                return data;
            }).then(resolve).catch((error)=>
            {
                reject(error);
            });
        });
    }
}
export const api = function()
{
    return new API();
}