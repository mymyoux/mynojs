import {Application as BaseApplication} from "myno/client/mvc/Application";
import App from "../Admin.vue";
import BootstrapVue from 'bootstrap-vue'
import Vue from 'vue'
import routes from "../routes";


import StringField from "../components/item/String";
import IntegerField from "../components/item/Integer";
import BooleanField from "../components/item/Boolean";
import BelongsToField from "../components/item/BelongsTo";
import HasManyField from "../components/item/HasMany";
import PictureField from "../components/item/Picture";
import Search from "../components/item/Search";
import ResourceItem from "../views/ResourceItem";

export class Application extends BaseApplication
{
    constructor()
    {
        super();
        this.insertStepBefore('vue','vueValidate')
    }
    vueValidate()
    {
    } 
    preconfig()
    {
        super.preconfig();
        Vue.use(BootstrapVue);
        Vue.component('myno-admin-item-item-string', StringField);
        Vue.component('myno-admin-item-item-integer', IntegerField);
        Vue.component('myno-admin-item-item-boolean', BooleanField);
        Vue.component('myno-admin-item-item-picture', PictureField);
        Vue.component('myno-admin-item-item-belongsTo', BelongsToField);
        Vue.component('myno-admin-item-item-hasMany', HasManyField); 
        Vue.component('myno-admin-item-item-search', Search); 
        Vue.component('myno-admin-resource-item', ResourceItem);
    }   
    router()
    {
        super.router();
    //     this._router.beforeEach((to, from, next)=>
    // {
    //     debugger;
    //     next();
    // })
    }
    preferences()
    {
      // do nothing
    }
    routes()
    {
        return routes.concat(super.routes());
    }
    // api()
    // {
    //     API.register({baseUrl:"https://local.experiment.myno.io:8443",adapter:Hardware.isElectron()?new ipc: new json/* adapter:new ipc*/});
    //     window["api"] = api;
    //     return api.boot();
    // }
    app()
    {
        return App;
    }
}