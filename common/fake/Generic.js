const fake = new Proxy(function(){
}, {
    _data:{},
    has: function(obj, prop) {
        // try{

        //     console.log('FAKE_HAS['+prop.toString()+']')
        // }catch(error)
        // {
        //     console.log('FAKE_HAS'); 
        // }
        return true;
    },
    get: function(obj, prop) {
        if(this._data[prop] !== undefined)
        {
            return this._data[prop];
        }
        // try{

        //     console.log('FAKE_GET['+prop.toString()+']')
        // }catch(error)
        // {
        //     console.log('FAKE_GET');
        // }
        return fake;
    },
    set: function(obj, prop, value) {
        this._data[prop] = value;
        // try{

        //     console.log('FAKE_SET['+prop.toString()+']')
        // }catch(error)
        // {
        //     console.log('FAKE_SET');
        //}
        return fake;
    },
    apply: function(target, thisArg, argumentsList) {
        // console.log('FAKE_APPLY')
        return fake;
      },
    ownKeys (target) {
        // console.log('FAKE_OWN_KEYS');
        return Reflect.ownKeys(this._data)
    }
});

export {fake};