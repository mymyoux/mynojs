const webpack = require('webpack');
//can't be used until node handle import/export
// const {configurationLoader} = require('../../server/services/ConfigurationLoader');
// const {Configuration} = require('../../server/env/Configuration');
const {configurationLoader, Configuration} = require('./configurationLoader');
configurationLoader.boot().then((config)=>
{
}, (error)=>
{
  console.log(error);
  process.exit(1);
})
var DefinePlugin = webpack.DefinePlugin;



class ConfigEnv {
  /**
   * The dotenv-webpack plugin.
   * @returns {webpack.DefinePlugin}
   */
  constructor ({
  } = {}) {

   
  }
  apply(compiler)
  {
    let vars = Configuration.getAllKeys().reduce((previous, key)=>
    {
      previous[key] = Configuration.get(key);
      return previous;
    }, {});

    const formatData = Object.keys(vars).reduce((obj, key) => {
      obj[`config.${key}`] = JSON.stringify(vars[key])
      return obj
    }, {})
    // formatData['config.hash'] = '"${hash}"';
    // console.log(compiler);
    // console.log("${hash}");

    return (new DefinePlugin(formatData)).apply(compiler);
  }
}
module.exports = ConfigEnv;