const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }]
    },
    optimization: {
        minimizer: [new UglifyJSPlugin({
            uglifyOptions: {
                output: {
                    comments: false //use it for removing comments like "/*! ... */"
                }
            }
        })]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                    from: 'src/assets',
                    to: 'assets'
                },
                {
                    from: 'src/style.css',
                    to: '.'
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            hash: true
        })
    ]
};