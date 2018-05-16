export function install(Vue, options)
{
    if (this.isSetup) {
        console.log('[router-storage]:has been installed')
        return;
    }
    this.isSetup = true;
    if(!options || !options.router)
    {
        throw new Error('router is required');
    }
    var first = null;


    let handler  =  function(to, from ,next)
    {
        next(false);
        const count = to.params.count | 1;
        if(count > 0 && history.count - count + 1 <= 0)
        {
            router.push(first);
        }
        return router.back(count);
    };
    var router = options.router;
    router.addRoutes([{
        'path':'/back/:count',
        'name':'back',
        beforeEnter:handler
    },
    {
        'path':'/back',
        'name':'_back',
        beforeEnter:handler
    }])
    var history = {
        hasPrevious:false,
        count:-1,
        _go:router.go.bind(router),
        url()
        {

        },
        back(count = 1, fallback = null)
        {
            if(count != null && typeof count != "number")
            {
                fallback = count;
                count = 1;
            }
            if(count > 0 && history.count - count + 1 <= 0)
            {
                if(fallback)
                {
                    return fallback;
                }
                if(!first)
                {
                    //should not occur
                    console.warn("no first");
                    return {name:"back", count:count}
                }
                if(first.meta.back)
                {
                    return first.meta.back;
                }
            }
            return {name:"back", count:count}
        },
        go(count = 1, fallback = null)
        {
            if(count != null && typeof count != "number")
            {
                fallback = count;
                count = 1;
            }
            if(count < 0 && history.count == 0)
            {
                if(fallback)
                {
                    return router.push(fallback);
                }
                if(!first)
                {
                    //should not occur
                    console.warn("no first");
                    return history._go(count);
                }
                if(first.meta.back)
                {
                    return router.push(first.meta.back);
                }

            }else
            {
                return history._go(count);
            }
        },
    };
    router.go = history.go
    Vue.mixin({
        beforeCreate () {
            var vm = this.$root;
            this._history = history;
        }
    });
    router.afterEach((to, next)=>
    {
        history.count++;
        if(!history.count)
        {
            first = {
                path:to.path,
                name:to.name,
                meta:to.meta};
        }
    });


    Object.defineProperty(Vue.prototype, '$history', {
        get () { return this._history }
        })
    window.addEventListener('popstate', ()=>
    {
        history.count-=2;
    })
}
     
export default {
    install
}