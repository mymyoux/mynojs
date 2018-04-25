import { CoreObject } from "../../common/core/CoreObject";
import { StepHandler } from "../../common/mixins/StepHandler";
import { configurationLoader } from "../services/ConfigurationLoader";
import { Configuration } from "../../common/env/Configuration";

export class Application extends StepHandler(CoreObject)
{
    _steps=["configuration", "server"];
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
    
}