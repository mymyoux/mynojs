<template>
  <v-layout row wrap>
    <v-flex lg4 offset-lg1 xs12 md5>
        <h1>Log in</h1>
        <connectors type="login"></connectors>
        <form lazy-validation>
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
            <v-btn @click="submit('login')">log in</v-btn>
        </form>
    </v-flex>
    <v-flex lgé fill-height xs12 md2>
         <h2>-&nbsp;or&nbsp;-</h2>
    </v-flex>
    <v-flex lg4 xs12 md5>
        <h1>Sign up</h1>
        <connectors type="signup"></connectors>
        <form>
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
            v-model="signup.username"
            :error-messages="errors.collect('username','signup')"
            label="Username"
            data-vv-name="username"
            required
            data-vv-validate-on="change"
            data-vv-scope="signup"
            @keydown="onUsernameKey"
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
            <v-btn @click="submit('signup')">sign up</v-btn>
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
                username:null
            },
            enableUserAuto:true
        };
    }
    onUsernameKey()
    {
        this.enableUserAuto = !this.signup.username;
    }
    onEmailKey()
    {
        if(!this.enableUserAuto)
            return;
        this.signup.username = this.signup.email.split('@')[0];
    }
    async submit(type)
    {
        await this.$validator.validate(type+'.*');
        let validated = !this.errors.any(type);
        if(!validated)
            return;
        debugger;
    }
    onSubmit()
    {
        api().path('auth/login/manual').params({
            email:this.email,
            password:this.password
        }).then((result)=>
        {
            
        },(error)=>
        {
            //eventer('toaster', {message:error.message, type:'error'});
            debugger;
        });
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

   
</style>
