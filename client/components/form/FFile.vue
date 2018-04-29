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
import {VueComponent, Component, Prop, Watch, Emit, Provide} from "../../mvc/VueComponent";
import Vue from 'vue';
import {Hardware} from "../../../common/env/Hardware";
import FElement from "./FElement";
import electron from "../../../common/electron/Electron";

@Component({
    $_veeValidate: {
        // fetch the current value from the innerValue defined in the component data.
        value () {
            debugger;
        return this.file;
        }
    }
})
export default class FFile extends FElement
{
      @Provide() $_veeValidate= {
        // fetch the current value from the innerValue defined in the component data.
        value () {
            debugger;
        return this.innerValue;
        },
        name()
        {
            debugger;
        }
    };

    @Prop({})
    value
    @Prop({default:'choose file'})
    dialog_message
    @Prop({default:()=>['openFile', 'showHiddenFiles']})
    dialog_properties
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
        }
    }
    onFile()
    {
        this.file = null;
        let file = this.$refs.file.files[0];

        if(!file)
        {
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
            debugger;
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
