import { CoreObject } from "../../common/core/CoreObject";
import { StepHandler } from "../../common/mixins/StepHandler";
import { configurationLoader } from "../services/ConfigurationLoader";
import { Configuration } from "../../common/env/Configuration";
import { Hardware } from "../../common/env/Hardware";
import { Window } from "../electron/Window";
import path from "path";
import electron from "../../common/electron/Electron";
import { Model } from "../../common/mvc/Model";
import es from 'event-stream'
import {
    api
} from "../io/API";
import {
    logger
} from "myno/common/debug/logger"
const debug = logger('myno:application');

export class Application extends StepHandler(CoreObject)
{
    _steps=["model","configuration", "database", "server","window", "commmands"];
    constructor()
    {
        super();
        if (process.argv.length > 2) {
            // cli -> no server
            this.removeStep('server')
        }
    }
    async boot()
    {
       await super.boot();
       this.booted();
    }
    model()
    {
        //Model.ID_NAME = "_id";
    }
    configuration()
    {
        return configurationLoader.boot().then(()=>
        {
            console.log("Environment: "+Configuration.env());
        })
    }
    database()
    {

    }
    booted()
    {
        console.log('app booted');
    }
    server()
    {
        console.log('server');
    }
    commmands() {
        process.stdin
        .pipe(es.split())
        .on('data', (data) => {
            this.onCommand(data)
        }); 

        //command line arguments -> cli
        if (process.argv.length > 2) {

            let params = process.argv.slice(2)
            let path = params.shift()
            params = params.reduce((previous, item) =>
            {
                let parts = item.split('=')
                let name = parts[0]
                while (name.substring(0, 1) == '-') {
                    name = name.substring(1)
                }
                name = name.trim()
                if (!name) {
                    console.log('[WARNING] argv parameters not understood: ' + item)
                } else {
                    let value;
                    if (parts.length == 1) {
                        value = true
                    } else {
                        value = parts.slice(1).join('=').trim()
                        if (value == '1' || value.toLowerCase() == 'true') {
                            value = true
                        }else
                        if (value == '0' || value.toLowerCase() == 'false') {
                            value = false
                        }
                    }
                    previous[name] = value
                }
                return previous
            }, {})
            // api.current = {path, params}
            debug('[Command] Execute: '+process.argv.slice(2))
            api().path(path).params(params).then((result) => {
                debug('[Command] Executed: ' + process.argv.slice(2))
                debug(result)
                process.exit(0)
            }).catch((error) =>
            {
                debug('[Command] Failed: ' + process.argv.slice(2))
                debug(error)
                process.exit(1)
            })
        }
    }
    onCommand(data) {
        console.log('COMMAND: ' + data)
    }
    window()
    {
        //no window
        if(!Hardware.isElectron())
        {
            return;
        }
        let url = Configuration.get('app.front_path')
        // electron.protocol.interceptFileProtocol('file', function (req, callback) {
        //     var url = req.url.substr(7);
        //     if (url.indexOf(base_path()) === 0) {
        //         url = url.substring(base_path().length)
        //     }
        //     let newurl = base_path(path.join('public', url))
        //     console.log('intercept', "\n", req.url, "\n", newurl, "\n", path.normalize(newurl), "\n", base_path())
        //     callback({
        //         path:path.normalize( newurl)
        //     })
        // })
        // if(Configuration.isProduction())
        // {
        //     url = "file://"+app_path('public/index.html');
        // }else
        // {
        //     url = 'http://localhost:8080/'
        // }
        console.log('LOADING', url, Configuration.env(), Configuration.isProduction())
        return new Promise((resolve, reject)=>
        {
            const app = electron.app;
            if(app.isReady())   
            {
                
                resolve();
                return;
            } 
            app.on('ready', ()=>
            {
                resolve();
            });
    
    
        }).then(()=>
        {
            Window.createWindow(url);
        });
        //TODO:
    }
    
}
/*

file:///tmp/.mount_endofqoZw4jb/resources/app.asar/public/index.html

*/