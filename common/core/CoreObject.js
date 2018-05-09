export class CoreObject
{
    dispose()
    {
        
    }
    clone()
    {
        let cls = this.constructor;
        let instance = new cls();
        instance.readExternal(this.writeExternal());
        return instance;
    }
}