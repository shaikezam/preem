module.exports = {
    entry: './preem.js',
    output: {
        filename: 'preem.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
};