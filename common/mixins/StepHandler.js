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
        handleSteps()
        {
            return this.steps();
        }
        steps()
        {
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