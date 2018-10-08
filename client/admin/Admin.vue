<template>
  <div id="app">
    <div id="nav">
      <myno-menu :content="menucontent">
      </myno-menu>
    </div>
    <router-view/>
    <toasts/>
  </div>
</template>

<script>
//import '@/assets/styles/css/fontawesome-all.min.css'


import {Auth} from 'myno/client/mvc/Auth';
import Toasts from 'myno/client/components/Toasts';
import {api} from 'myno/client/io/API';
import Menu from './views/Menu';
export default {
  components:{
    Toasts,
    'myno-menu':Menu
  },
  created()
  {
    api().path('admin/menu/get').then((data)=>
    {
      this.menucontent = data;
    })
  },
  data () {
    return {
      auth:Auth.binding(),
      menucontent:null
    }
  }
}
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display:flex;
}
#nav {
  padding: 30px;
  width:300px;
  //background:red;
  height:100vh;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
