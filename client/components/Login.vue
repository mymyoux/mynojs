<template>
  <v-layout row wrap>
    <v-flex lg4 offset-lg1 xs12 md5>
        <h1>Log in</h1>
        <connectors type="login"></connectors>
        <form lazy-validation @submit.prevent="submit('login')">
            <v-text-field
            v-validate="'required|email'"
            v-model="login.email"
            :error-messages="errors.collect('email', 'login')"
            label="E-mail"
            data-vv-name="email"
            required
            data-vv-validate-on="change"
            data-vv-scope="login"
            ></v-text-field>
            <v-text-field
            v-validate="'required'"
            v-model="login.password"
            :error-messages="errors.collect('password', 'login')"
            label="Password"
            type="password"
            data-vv-name="password"
            required
            data-vv-validate-on="change"
            data-vv-scope="login"
            ></v-text-field>
            <p  class="error-msg">&nbsp;
                 <template v-if="error.login">{{error.login}}</template>
            </p>
            <v-btn :disabled="loading" type="submit">log in</v-btn>
        </form>
    </v-flex>
    <v-flex lgé fill-height xs12 md2>
         <h2>-&nbsp;or&nbsp;-</h2>
    </v-flex>
    <v-flex lg4 xs12 md5>
        <h1>Sign up</h1>
        <connectors type="signup"></connectors>
        <form lazy-validation @submit.prevent="submit('signup')">
            <v-text-field
            v-validate="'required|email|emailExists'"
            v-model="signup.email"
            :error-messages="errors.collect('email','signup')"
            label="E-mail"
            data-vv-name="email"
            required
             data-vv-validate-on="change"
             data-vv-scope="signup"
             @keyup="onEmailKey"
             @change="onEmailKey"
            ></v-text-field>
            <v-text-field
            v-validate="'required|usernameExists'"
            v-model="signup.name"
            :error-messages="errors.collect('name','signup')"
            label="name"
            data-vv-name="name"
            required
            data-vv-validate-on="change"
            data-vv-scope="signup"
            @keydown="onnameKey"
            ></v-text-field>
            <v-text-field
            v-validate="'required'"
            v-model="signup.password"
            :error-messages="errors.collect('password','signup')"
            label="Password"
            type="password"
            data-vv-name="password"
            required
            data-vv-validate-on="change"
            data-vv-scope="signup"
            ref="signup.password"
            ></v-text-field>
            <v-text-field
            v-validate="'required|confirmed:signup.password'"
            v-model="signup.password_confirmation"
            :error-messages="errors.collect('password_confirmation','signup')"
            label="Password confirmation"
            type="password"
            data-vv-name="password_confirmation"
            required
            data-vv-validate-on="change"
            data-vv-scope="signup"
            ></v-text-field>
            <p  class="error-msg">&nbsp;
                 <template v-if="error.signup">{{error.signup}}</template>
            </p>
            <v-btn type="submit" :disabled="loading">sign up</v-btn>
        </form>
    </v-flex>
  </v-layout>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import Connectors from 'myno/client/components/Connectors.vue'
import {event} from 'myno/common/events/Bus';
import { config } from "../../common/env/Configuration";
import { api } from "myno/client/io/API";
@Component({
  components: {
    Connectors,
  }
})
export default class Login extends VueComponent
{
    data()
    {
        return {
            login:
            {
                email:null,
                password:null,
            },
            signup:
            {
                email:null,
                password:null,
                password_confirmation:null,
                name:null
            },
            error:
            {
                signup:null,
                login:null
            },
            enableUserAuto:true,
            loading:false
        };
    }
    onnameKey()
    {
        this.enableUserAuto = !this.signup.name;
    }
    onEmailKey()
    {
        if(!this.enableUserAuto)
            return;
        this.signup.name = this.signup.email.split('@')[0];
    }
    async submit(type)
    {
        if(this.loading)
            return;
         this.error = {
            signup:null,
            login:null
        };
        await this.$validator.validate(type+'.*');
        let validated = !this.errors.any(type);
        if(!validated)
            return;


        this.loading = true;
        let request = this[type];
        api().path('auth/'+type+'/manual').params(request).then((result)=>
        {
           Auth.setRawUser(result).then(()=>{
               this.$router.replace({name:'home'})
           })
        },(error)=>
        {
            this.error[type] = error.message;
        }).finally(()=>
        {
            this.loading = false;
        })
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.error-msg
{
    color: red;
    text-align: left;
}
   
</style>
