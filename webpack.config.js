const path = require("path");
const yargs = require("yargs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");


const options = yargs.alias("p", "production").argv;
const isProduction = options.production;

const webpackConfig = {
    entry: {
        index: ["@babel/polyfill", path.resolve(__dirname, "src/index.js")],
        login: ["@babel/polyfill", path.resolve(__dirname, "src/login.js")],
        register: ["@babel/polyfill", path.resolve(__dirname, "src/register.js")],
        forgotPassword: ["@babel/polyfill", path.resolve(__dirname, "src/forgotPassword.js")],
        changePassword: ["@babel/polyfill", path.resolve(__dirname, "src/changePassword.js")],
        recoverPassword: ["@babel/polyfill", path.resolve(__dirname, "src/recoverPassword.js")],
    },
    output: {
        path: !isProduction ?
            path.resolve(__dirname, "dist") :
            path.resolve(__dirname, "dist", "[git-revision-hash]"),
        publicPath: isProduction ? "./" : "/",
        filename: '[name].js'
    },
    watch: false,
    plugins: [
        new FriendlyErrorsWebpackPlugin(),

        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: "./login.html",
            filename: "login.html",
            chunks: ['login']
        }),
        new HtmlWebpackPlugin({
            template: "./register.html",
            filename: "register.html",
            chunks: ['register']
        }),
        new HtmlWebpackPlugin({
            template: "./changePassword.html",
            filename: "changePassword.html",
            chunks: ['changePassword']
        }),
        new HtmlWebpackPlugin({
            template: "./forgotPassword.html",
            filename: "forgotPassword.html",
            chunks: ['forgotPassword']
        }),
        new HtmlWebpackPlugin({
            template: "./recoverPassword.html",
            filename: "recoverPassword.html",
            chunks: ['recoverPassword']
        }),
        new CopyWebpackPlugin([{
            from: "assets",
            to: "assets",
        }, ]),
        new CopyWebpackPlugin([{
            from: "lib",
            to: "lib",
        }, ]),
        new CopyWebpackPlugin([{
            from: "fonts",
            to: "fonts",
        }, ]),
        new CopyWebpackPlugin([{
            from: "bottle-data",
            to: "bottle-data",
        }, ]),
    ],
    module: {
        rules: [{
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /pixi\.js/,
                use: "expose-loader?PIXI",
            },
            {
                test: /phaser-split\.js$/,
                use: "expose-loader?Phaser",
            },
            {
                test: /p2\.js/,
                use: "expose-loader?p2",
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/,
                loader: "url-loader?limit=100000",
            },
        ],
    },

    devServer: {
        // host: "192.168.1.116",
        // host: "192.168.1.237",
        // host: "192.168.0.102", // home
        historyApiFallback: true,
        quiet: true,
    },
};

if (!isProduction) {
    webpackConfig.devtool = "inline-source-map";
}

module.exports = webpackConfig;