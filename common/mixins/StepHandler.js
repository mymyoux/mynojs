import { Configuration } from "../env/Configuration";
import colors from "colors";
import { Classes } from "../utils/Classes";
import { Hardware } from "../env/Hardware";
export function StepHandler(parent)
{
    let steps = 0;
    return class StepHandler extends parent
    {
        _steps = [];
        async boot()
        {
            await this.handleSteps();
        }
        insertStepBefore(before, step)
        {
            let index = this._steps.indexOf(before);
            if(!~index)
            {
                throw new Error("step "+before+" not found");
            }
            this._steps.splice(index, 0, step);
        }
        insertStepAfter(after, step)
        {
            let index = this._steps.indexOf(after);
            if(!~index)
            {
                throw new Error("step "+after+" not found");
            }
            this._steps.splice(index+1, 0, step);
        }
        handleSteps()
        {
            return this.steps();
        }
        steps()
        {
            console.log('step', this._steps);
            if(!this._steps[steps])
            {
                //end
                return this.bootedSteps();
            }
            let step = this._steps[steps];
            if(!this[step])
            {
                throw new Error('Error step '+step+' doesn\'t exist in ', this);
            }
            if(typeof this[step] != "function")
            {
                throw new Error('Error step '+step+' is not a function ', this);
            }
            if(Configuration.isDebug())
            {
                console.log('debug');
                if(Hardware.isNode())
                {
                    console.log('node');
                    console.log(colors.gray(Classes.getName(this))+"["+colors.red('step')+"]: "+step);
                }else{
                    
                    console.log('pas node');
                    console.log(Classes.getName(this)+"["+'step'+"]: "+step);
                }
            }else
            {
                console.log('not debug');
            }
            let result = this[step]();
            if(!(result instanceof Promise))
            {
                result = Promise.resolve(result);
            }
            return result.then(()=>
            {
                steps++;
                return this.steps();
            },(error)=>
            {
                console.error('Error during step '+step, error, this);
            });
        }
        bootedSteps()
        {
        }
    }
}