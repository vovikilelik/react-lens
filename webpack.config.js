const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist')
};

const config = {
    context: paths.src,
    
    entry: {
        app: './test/index'
    },
    
    target: 'web',
    
    output: {
        path: paths.dist,
        filename: '[name].bundle.js'
    },
    
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'] // добавляем расширение tsx для файлов с react компонентами
    },

    devtool: 'inline-source-map',
    
    module: {
        rules: [
            {
                test: /\.tsx?$/, // добавляем расширение tsx для файлов с react компонентами
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './test/index.html'
        }) // генерация html-файла на основе нашего шаблона
    ]
};

module.exports = config;