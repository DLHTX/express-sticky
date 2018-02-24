var webpack = require('webpack')
var path = require('path')

module.exports = {
    entry: path.join(__dirname,'js/app/index.js'),
    output: {
        path: path.join(__dirname,'../public/js'),
        filename: 'index.js'
    },
    module:{
      rules: [
          {
             test:  /\.(less|css)$/,
              use:[ 'style-loader','css-loader','less-loader'],
          }
      ]
    },
    resolve:{
        alias: {
            jquery: path.join(__dirname,"js/lib/jquery.min.js"),
            less: path.join(__dirname, "less")
        }
    },
};