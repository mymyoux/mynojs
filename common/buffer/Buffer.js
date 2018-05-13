import { Maths } from "../utils/Maths";

export class Buffer
{
    _buffer = [];
    push(method,scope, ...params)
    {
        let buffer = {method, scope, params};
        let promise = new Promise((resolve, reject)=>
        {
           buffer.resolve = resolve;
           buffer.reject = reject;
        })
        buffer.promise = promise;
        this._buffer.push(buffer);
        return promise;
    }
    unshift(method,scope, ...params)
    {
        let buffer = {method, scope, params};
        let promise = new Promise((resolve, reject)=>
        {
           buffer.resolve = resolve;
           buffer.reject = reject;
        })
        buffer.promise = promise;
        this._buffer.unshift(buffer);
        return promise;
    }
    get current()
    {
        return this._buffer[0];
    }
    get length()
    {
        return this._buffer.length;
    }
    execute()
    {
        let buffer = this._buffer.shift();
        try
        {
            let result = buffer.method.apply(buffer.scope, buffer.params);
            if(result instanceof Promise)
            {
                result.then(buffer.resolve, buffer.reject);
            }else{
                buffer.resolve(result);
            }
        }catch(error)
        {
            buffer.reject(error);
        }
    }
    success(data)
    {
        let buffer = this._buffer.shift();
        buffer.resolve(data);
    }
    fail(data)
    {
        let buffer = this._buffer.shift();
        buffer.reject(data);
    }
    static throttle (func, limit){
        let inThrottle
        let throttledData;
        let throttledContext;
        let throttled = false;

        function execute(context, args)
        {
            inThrottle = true
            func.apply(context, args);
            setTimeout(() => 
            {
                inThrottle = false;
                if(throttled)
                {
                    throttled = false;
                    let data = throttledData;
                    if(context !== throttledContext)
                    {
                        debugger;
                    }
                    let ctxt = throttledContext;
                    throttledContext = null;
                    throttledData = null
                    execute(ctxt, data);
                }
            }, limit)
        }

        return function(event) {
            const args = arguments
            const context = this
            if(throttledContext && throttledContext!==context)
            {
                debugger;
            }
            if (!inThrottle) {
                execute(context, args)
            }else
            {
                throttledData = args;
                throttledContext = context;
                throttled = true;
            }
        }
      }
      static  debounce(func, delay){
        let inDebounce
        return function() {
          const context = this
          const args = arguments
          clearTimeout(inDebounce)
          inDebounce = setTimeout(() => func.apply(context, args), delay)
        }
      }
    
}