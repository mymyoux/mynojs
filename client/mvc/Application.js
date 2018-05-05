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
import FColor  from "myno/client/components/form/FColor";
import FInput  from "myno/client/components/form/FInput";
import VeeValidate from 'vee-validate';
export class Application extends StepHandler(CoreObject)
{
    _steps=["debug","preconfig","api", "configuration", "router", "form","user", "selector", "app", "vue"];
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
            {
                next(); 
            }
        })
    }
    form()
    {
     

        Vue.use(VeeValidate);
        Vue.component('f-file', FFile);
        Vue.component('f-radiolist', FRadioList);
        Vue.component('f-color', FColor);
        Vue.component('f-input', FInput);
    }
    routes()
    {
        //throw new Error('you must override Application#routes');
        return [{
            path:"/debug",
            name:"debug",
            component:Debug
        },{
            path:"/",
            name:"debughome",
            component:Debug
        },
        {
            path:"/login",
            name:"login",
            component:Login
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
    booted()
    {
        console.log('app booted');
    }
    
}