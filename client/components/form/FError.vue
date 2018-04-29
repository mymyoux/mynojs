<template>
    <p>
        <slot v-bind:message="error">
            {{error}}
        </slot>
    </p>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit} from "../../mvc/VueComponent";
import Vue from 'vue';

//@Global
@Component
export default class FError extends VueComponent
{
    data()
    {
        return {error:null};
    }
    

   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
