import { CoreObject } from "../../common/core/CoreObject";
import { StepHandler } from "../../common/mixins/StepHandler";
import { API, api } from "../io/API";
import { Auth } from "./Auth";
import VueRouter from "vue-router";
import Vue from "vue";
import Debug from "../components/Debug.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import { Configuration, config } from "../../common/env/Configuration";
import { getAllScroll } from "../debug/HTML";
import FFile  from "myno/client/components/form/FFile";
import FRadioList  from "myno/client/components/form/FRadioList";
import List  from "myno/client/components/List";
import FColor  from "myno/client/components/form/FColor";
import FInput  from "myno/client/components/form/FInput";
import Tree  from "myno/client/components/Tree";
import DragBar  from "myno/client/components/DragBar";
import Search  from "myno/client/components/Search";
import TreeItem  from "myno/client/components/tree/TreeItem";
import ContextMenu  from "myno/client/components/ContextMenu";
import VerticalResizer  from "myno/client/components/VerticalResizer";
import HorizontalResizer  from "myno/client/components/HorizontalResizer";
import vClickOutside from 'v-click-outside'
import VeeValidate from 'vee-validate';
import { make, register } from "../../common/maker/make";
import { User } from "../models/User";
import { Validator } from 'vee-validate';
import { host } from "../components/form/validators/host";
import { path } from "../components/form/validators/path";
import { file_exists } from "../components/form/validators/file_exists";
import { Model } from "../../common/mvc/Model";
import { WindowBusMiddleware } from "../events/WindowBusMiddleware";
import { DocumentBusMiddleware } from "../events/DocumentBusMiddleware";
import { KeyboardShortcutHelper } from "../helpers/KeyboardShortcutHelper";
import VueHistory from "../vue/History";
import vuewheel from 'vuewheel'
import { preferences } from "../env/Preferences";
import { Hardware } from "myno/common/env/Hardware";
import { ipc } from "myno/client/io/api/ipc";
import { json } from "myno/client/io/api/json";
import { event } from "myno/common/events/Bus";
import {BaseWorker} from "myno/client/mvc/workers/BaseWorker";
import preconfig from '../../../config.js';
import {MenuHelper} from "myno/client/electron/MenuHelper";
export class Application extends StepHandler(CoreObject)
{
    _steps=["debug","model","preconfig","maker","api", "configuration","preferences", "router", "initVue","user", "selector", "app", "events","electron","vue", "workers"];
    _stepsWorker=["debug","model","preconfig","maker","api", "configuration","preferences", "worker"];
    _router =  null;
    _selector =  null;
    _app =  null;
    async boot()
    {
        window['Auth'] = Auth;
        //event is already taken by magic object event
        window['eventer'] = event;
        window['preferences'] = preferences;
        console.log('app loading');
        if(BaseWorker.isWorker())
        {
            this._steps = this._stepsWorker;
        }
        await super.boot();
       this.booted();
    }
    insertStepBefore(before, step, worker = true)
    {
        super.insertStepBefore(before, step);
        if(worker)
        {
            let index = this._stepsWorker.indexOf(before);
            if(!~index)
            {
                console.warn("step[worker] "+before+" not found");
                return;
            }
            this._stepsWorker.splice(index, 0, step);
        }
    }
    debug()
    {
        window.getAllScroll = getAllScroll;
        window.onerror = function ( message, filename, lineno, colno, error ){
            console.error(error);
            debugger;
        }
        window.addEventListener("unhandledrejection", function(error, promise) { 
            console.error(error);
            debugger;
        });
    }
    model()
    {
        //Model.ID_NAME = "_id";
    }
    maker()
    {
        register('user', User);
    }
    preconfig()
    {
        Configuration.merge(preconfig);
    }
    api()
    {
        let url = config.has('api.url')?config('api.url'):window.location.origin;
        let credentials = !~url.indexOf(window.location.origin);
        API.register({withCredentials:credentials,baseUrl:url,adapter:Hardware.isElectron()?new ipc: new json});
        window["api"] = api;
        return api.boot();
    }
    configuration()
    {
        
        // return api("configuration").path('configuration/get').then((data)=>
        // {
        //     Configuration.merge(data);
        // })
    }
    preferences()
    {
        return preferences.boot();
    }
    router()
    {
        console.log('router');
        Vue.use(VueRouter)
        this._router = new VueRouter({routes:this.routes()});
        window["router"] = this._router;
        Vue.use(VueHistory, {router:this._router});/*
            Vue.use({
                install(Vue, options)
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
                            first = to;
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
            
            },{router:this._router})*/
        // this._router.beforeEach((to, from, next)=>
        // {
        //     if(to.meta.requiresAuth && !Auth.check())
        //     {
        //         next({name:"login", params:{message:"restricted page"}});
        //     }else
        //     if(to.meta.requiresUnauth && Auth.check())
        //     {
        //         next({name:"home"});
        //     }else
        //     {
        //         next(); 
        //     }
        // })
        this._router.beforeResolve((to, from, next)=>
        {
            if(to.meta.requiresAuth && !Auth.check())
            {
                next({name:"login", params:{message:"restricted page"}});
            }else
            if(to.meta.requiresUnauth && Auth.check())
            {
                next({name:"home"});
            }else
            {
                next(); 
            }
        });
    }
    initVue()
    {
        if(Configuration.isDebug())
        {
            Vue.config.devtools = true
            Vue.config.performance = true
        }

        Vue.use(VeeValidate);
        Vue.use(vClickOutside)
        Vue.use(vuewheel)
        
        Validator.extend('file_exists', file_exists);
        Validator.extend('host', host);
        Validator.extend('path', path);
        Vue.component('search',Search);
        Vue.component('vertical-resizer',VerticalResizer);
        Vue.component('horizontal-resizer',HorizontalResizer);
        Vue.component('list',List);
        Vue.component('f-radiolist', FRadioList);
        Vue.component('f-file', FFile);
        Vue.component('f-color', FColor);
        Vue.component('f-input', FInput);
        Vue.component('tree', Tree);
        Vue.component('tree-item', TreeItem);
        Vue.component('context-menu', ContextMenu);
        Vue.component('drag-bar', DragBar);

    }
    routes()
    {
        //throw new Error('you must override Application#routes');
        return [
        {
            path:'/logout',
            name:'logout',
            beforeEnter: (to, from, next) => {
                Auth.logout();
                next({replace:true,name:'login'}) 
              }
        },    
        {
            path:"/debug",
            name:"debug",
            component:Debug
        },{
            path:"/",
            name:"home",
            component:Debug
        },
        {
            path:"/login",
            name:"login",
            component:Login,
            meta:
            {
                requiresUnauth:true
            }
        },
        {
            path:"/register",
            name:"register",
            component:Register,
            meta:
            {
                requiresUnauth:true
            }
        }];
    }
    user()
    {
        return Auth.retrieveUser();
    }
    selector()
    {
        this._selector = "#app";
    }
    app()
    {
        throw new Error('you must override Application#app');
    }
    electron()
    {
        if(!Hardware.isElectron())
        {
            return;
        }
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            MenuHelper.open(e);
        }, false);
    }
    vue()
    {
        console.log('vue');
       this._vue = new Vue({
            router:this._router,
            store:this._store,
            render: h => h(this.app())
          }).$mount(this._selector) 
    //     console.log(this._vue);
    //     console.log(this);
    }
    events()
    {
        WindowBusMiddleware.register();
        DocumentBusMiddleware.register();
        KeyboardShortcutHelper.register();
        // window.addEventListener('resize',()=>
        // {
        //     bus.trigger('window:resize')
        // })
    }
    worker()
    {
        BaseWorker.listen();
    }
    workers()
    {

    }
    booted()
    {
        console.log((BaseWorker.isWorker()?'[worker]':'[main]')+'app booted');
    }
    
}