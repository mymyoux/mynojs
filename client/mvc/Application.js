import { CoreObject } from "../../common/core/CoreObject";
import { StepHandler } from "../../common/mixins/StepHandler";
import { API, api } from "../io/API";
import { Auth } from "./Auth";
import VueRouter from "vue-router";
import Vue from "vue";
import Debug from "../components/Debug.vue";
import Login from "../components/Login.vue";
import { Configuration } from "../../common/env/Configuration";
import { getAllScroll } from "../debug/HTML";
import FFile  from "myno/client/components/form/FFile";
import FRadioList  from "myno/client/components/form/FRadioList";
import List  from "myno/client/components/List";
import FColor  from "myno/client/components/form/FColor";
import FInput  from "myno/client/components/form/FInput";
import Tree  from "myno/client/components/Tree";
import DragBar  from "myno/client/components/DragBar";
import TreeItem  from "myno/client/components/tree/TreeItem";
import ContextMenu  from "myno/client/components/ContextMenu";
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
export class Application extends StepHandler(CoreObject)
{
    _steps=["debug","model","preconfig","maker","api", "configuration", "router", "initVue","user", "selector", "app", "events","vue"];
    _router =  null;
    _selector =  null;
    _app =  null;
    async boot()
    {
        console.log('app loading');
       await super.boot();
       this.booted();
    }
    debug()
    {
        window.getAllScroll = getAllScroll;
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
        
    }
    api()
    {
        API.register({baseUrl:window.location.origin});
        return api.boot();
    }
    configuration()
    {
        return api.request().path('configuration/get').then((data)=>
        {
            Configuration.merge(data);
        })
    }
    router()
    {
        console.log('router');
        Vue.use(VueRouter)
        this._router = new VueRouter({routes:this.routes()});
        this._router.beforeEach((to, from, next)=>
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
        })
    }
    initVue()
    {
     

        Vue.use(VeeValidate);
        Vue.use(vClickOutside)
        
        Validator.extend('file_exists', file_exists);
        Validator.extend('host', host);
        Validator.extend('path', path);
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
    vue()
    {
        console.log('vue');
       this._vue = new Vue({
            router:this._router,
            render: h => h(this.app())
          }).$mount(this._selector) 
    //     console.log(this._vue);
    //     console.log(this);
    }
    events()
    {
        WindowBusMiddleware.register();
        // window.addEventListener('resize',()=>
        // {
        //     bus.trigger('window:resize')
        // })
    }
    booted()
    {
        console.log('app booted');
    }
    
}