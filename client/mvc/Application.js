import { CoreObject } from "../../common/core/CoreObject";
import { StepHandler } from "../../common/mixins/StepHandler";
import { API, api } from "../io/API";
import { Auth } from "./Auth";
import VueRouter from "vue-router";
import Vue from "vue";
import Debug from "../components/Debug.vue";
import Login from "../components/Login.vue";

export class Application extends StepHandler(CoreObject)
{
    _steps=["api", "configuration", "router", "user", "selector", "app", "vue"];
    _router =  null;
    _selector =  null;
    _app =  null;
    async boot()
    {
       await super.boot();
       this.booted();
    }
    api()
    {
        API.register({baseUrl:'http://yb.local/'});
        API.register("v2",{});

        api.boot();
        api.instance("v2").boot();
        console.log('api', api);
        window["api"] = api;
        api.request().path('test/test').param("test","ok").then((data)=>{console.log('resolve', data);},(error)=>{console.log('error', error);})
        console.log('next');
        api.request().path('test/test').param("test","ok").then((data)=>{console.log('resolve', data);},(error)=>{console.log('error', error);})
        console.log('next');
    }
    configuration()
    {
        return api.request().path('configuration/get').then((data)=>
        {
            console.log(data);  
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
    routes()
    {
        //throw new Error('you must override Application#routes');
        return [{
            path:"/",
            name:"debug",
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