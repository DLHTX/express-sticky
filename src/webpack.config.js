var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')


module.exports = {
    entry: path.join(__dirname,'js/app/index.js'),
    output: {
        path: path.join(__dirname,'../public/js'),
        filename: 'index.js'
    },
    module:{
      rules: [
          {
             test:  /\.less$/,
              use: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: ["css-loader", "less-loader", "postcss-loader"]
              })
          }]
    },
    resolve:{
        alias: {
            jquery: path.join(__dirname,"js/lib/jquery.min.js"),
            less: path.join(__dirname, "less"),
            mod: path.join(__dirname, "js/mod")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery"
        }) ,
        new ExtractTextPlugin("../css/index.css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer(),
                ]
            }
        })

    ]
};