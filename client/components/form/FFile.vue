<template>
    <p>
        <input v-if="electron" type="button" @click="loadFile" :value="dialog_message">
        <input v-else type="file" @change="onFile" ref="file">
         <f-progress>

      </f-progress>
   </p> 
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit} from "../../mvc/VueComponent";
import Vue from 'vue';
import {Hardware} from "../../../common/env/Hardware";
import FElement from "./FElement";
import electron from "../../../common/electron/Electron";

@Component
export default class FFile extends FElement
{
    @Prop({default:'choose file'})
    dialog_message
    @Prop({default:()=>['openFile', 'showHiddenFiles']})
    dialog_properties

    data()
    {
        return {electron:Hardware.isElectron() };
    }
    loadFile()
    {
        let result = electron.remote.dialog.showOpenDialog({properties:this.dialog_properties,message:this.dialog_message});
        if(result)
        {
            console.log( {path:result[0]});
            this.$emit('value', {path:result[0]})
        }
    }
    onFile()
    {
        let file = this.$refs.file.files[0];

        if(!file)
        {
            return;
        }
        var reader = new FileReader();
        reader.onload = ()=>
        {
            console.log({path:file.name, text:reader.result});
            this.$emit('value', {path:file.name, text:reader.result})
        }
        reader.readAsText(file);
    }
    getFormData()
    {
        return "mon file";
    }
    mounted()
    {
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
