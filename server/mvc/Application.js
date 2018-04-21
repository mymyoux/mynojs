import { CoreObject } from "../../common/core/CoreObject";
import { StepHandler } from "../../common/mixins/StepHandler";

export class Application extends StepHandler(CoreObject)
{
    _steps=[];
    async boot()
    {
       await super.boot();
       this.booted();
    }
    booted()
    {
        console.log('app booted');
    }
    
}