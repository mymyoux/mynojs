import Vue from 'vue'

import {Application} from "./app/Application";
//import store from './store'
//import './registerServiceWorker'


let app = new Application
app.boot();
window['app'] = app;
 Vue.config.productionTip = false;