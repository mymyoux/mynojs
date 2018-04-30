import { CoreObject } from "../../common/core/CoreObject";
import { StepHandler } from "../../common/mixins/StepHandler";
import { configurationLoader } from "../services/ConfigurationLoader";
import { Configuration } from "../../common/env/Configuration";
import { Hardware } from "../../common/env/Hardware";
import { Window } from "../electron/Window";
import path from "path";
import electron from "../../common/electron/Electron";
export class Application extends StepHandler(CoreObject)
{
    _steps=["configuration", "server","window"];
    constructor()
    {
        super();
    }
    async boot()
    {
       await super.boot();
       this.booted();
    }
    configuration()
    {
        return configurationLoader.boot().then(()=>
        {
                console.log("Environment: "+Configuration.env());
        })
    }
    booted()
    {
        console.log('app booted');
        console.log(Configuration.get());
    }
    server()
    {
        console.log('server');
    }
    window()
    {
        //no window
        if(!Hardware.isElectron())
        {
            return;
        }
        let url;
        if(Configuration.isProduction())
        {
            url = "file://"+app_path('public/renderer/index.html');
        }else
        {
            url = 'http://localhost:8080/'
        }
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