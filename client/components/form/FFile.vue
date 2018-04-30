<template>
    <p>
        <template v-if="electron">
            <input type="button" @click="loadFile" :value="dialog_message" ref="file">
            <input type="text" :value="file && file.path" disabled>
        </template>
        <template v-else>
            <input type="file" @change="onFile" ref="file" :placeholder="file && file.path">
            <span v-if="showPrevious">{{typeof value == "string"?value:value.path}}</span>
        </template>
   </p> 
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Provide,Event} from "../../mvc/VueComponent";
import Vue from 'vue';
import {Hardware} from "../../../common/env/Hardware";
import FElement from "./FElement";
import electron from "../../../common/electron/Electron";

@Component({
    $_veeValidate: {
        //not used when using v-model
        value () {
            return this.file;
        }
    },
    props:
    {
        value:{},
        dialog_message:{default:'choose file',type:String},
        dialog_properties:{default:()=>['openFile', 'showHiddenFiles']}
    }
})
export default class FFile extends FElement
{
    data()
    {
        return {electron:Hardware.isElectron(), file:null,showPrevious:null };
    }
    loadFile()
    {
        let result = electron.remote.dialog.showOpenDialog({properties:this.dialog_properties,message:this.dialog_message});
        if(result)
        {
            console.log( {path:result[0]});
            this.file =  {path:result[0]}
            this.showPrevious = false;
            this.$emit('input', this.file)
        }else
        {
            this.file = null;
            this.$emit('input', null);
        }
    }
    onFile()
    {
        let file = this.$refs.file.files[0];

        if(!file)
        {
            this.file = null;
            this.$emit('input', null);
            return;
        }
        var reader = new FileReader();
        reader.onload = ()=>
        {
            console.log({path:file.name, text:reader.result});
            this.file = {path:file.name, text:reader.result}
            this.showPrevious = false;
            debugger;
            this.$emit('input', this.file)
        }
        
        reader.readAsText(file);
    }
    mounted()
    {
        if(this.value)
        {
            this.file = typeof this.value == "string"?{path:this.value}:Object.assign({},this.value);
        }
        this.showPrevious = true;
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
