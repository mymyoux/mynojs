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

export class Application extends StepHandler(CoreObject)
{
    _steps=["model","configuration", "database", "server","window", "commmands"];
    constructor()
    {
        super();
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
    }
    onCommand(data) {

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