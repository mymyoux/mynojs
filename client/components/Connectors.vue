<template>


<div class="section row">
    <div v-for="(connector, i) in connectors" class="col-md-6" :key="i">
        <a  :href="base+'/'+type+'/' + connector.name" class="button btn-social span-left btn-block" :class="connector.name">
        <span>
            <i :class="'fab fa-' + connector.name"></i>
        </span>{{ connector.name }}</a>
    </div>
</div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit} from "../../client/mvc/VueComponent";
import Vue from 'vue';
import { api } from "myno/client/io/API";

import { config } from "../../common/env/Configuration";
@Component({
  props:
  {
    baseHref:{required:false, type:String,default:null},
    type:{required:true, type:String}
  }
})
export default class Connectors extends VueComponent
{
    created()
    {
    }
    data()
    {
        let a = api();
        api().path('connector/'+this.type).then( (data) => {
            this.connectors = data;
        });

        return {
          connectors: [],
          base:this.baseHref?this.baseHref:config('api.url')
        };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

$break-mobile: 400px;
$break-tablet: 768px;

    h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.btn-social
{
    transition: all 0.5s ease-in-out;
    color: #fff;
    text-shadow: 0 1px rgba(0, 0, 0, 0.08);
    height: 42px;
    line-height: 42px;
    font-size: 15px;
    cursor: pointer;
    padding: 0 18px;
    text-align: center;
    background: #DBDBDB;
    width: 200px;
    text-transform: capitalize;

    @media (max-width: $break-tablet) {
        width: 100%;
        margin-bottom: 10px;
    }

    span {
        border-radius: 3px 0 0 3px;
        display: inline-block;
        text-align: center;
        position: absolute;
        width: 45px;
        left: 0;
        i {
            font-size: 1.2em;
        }
    }

    &.google
    {
        background-color: #dd4b39;
        font-weight: 500;
        span {
            background-color: #C03121;
        }
        &:hover
        {
            background-color: #8D2418;
            text-decoration: none;
        }
    }

    &.linkedin
    {
        background-color: #448ecc;
        font-weight: 500;
        span {
            background-color: #2b7ab9;
        }
        &:hover
        {
            background-color: #1e5f94;
            text-decoration: none;
        }
    }
    svg {
        font-size: 22px;
        font-weight: normal;
        position: relative;
        top: 3px;
    }
}

</style>
