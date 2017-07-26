module.exports = {
    entry: './src/preem.js',
    output: {
        filename: 'preem_browser.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
};