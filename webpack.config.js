// webpack.config.js
const path = require('path'); // подключаем path к конфигу вебпак
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    
    return {
        entry: { main: './src/index.js' },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'main.[contenthash].js' : 'main.js',
            // Динамическое переключение publicPath в зависимости от режима
            publicPath: isProduction ? './' : '/',
            clean: true // Очищает папку dist перед каждой сборкой
        },
        mode: isProduction ? 'production' : 'development',
        // Source maps только для development
        devtool: isProduction ? false : 'eval-source-map',
        devServer: {
            static: path.resolve(__dirname, './dist'),
            compress: true,
            port: 9000,
            open: true,
            hot: true // Hot Module Replacement
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[hash][ext]'
                    }
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, {
                        loader: 'css-loader',
                        options: {
                          importLoaders: 1
                        }
                      },
                      'postcss-loader'
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: isProduction ? 'main.[contenthash].css' : 'main.css'
            })
        ]
    };
};

