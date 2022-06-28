var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        client: {
            import: "./src/index.js"
        }
    },
    devtool: "source-map",
    mode: "development",
    target: "web",
    resolve: {
        extensions: [".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'WebBot',
            // filename: 'dist/index.html',
            template: 'index.html',
            filename: 'index.html',
            chunks: ["client"]
            // Load a custom template (lodash by default)
        })
    ]
};