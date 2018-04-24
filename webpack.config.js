module.exports = {
    entry: './src/preem.js',
    output: {
        filename: './dist/preem.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },{
            test: /\.css$/,
            use: [
                {loader: "style-loader"},
                {loader: "css-loader"}
            ]
        }]
    },
    devtool: 'source-map',
};