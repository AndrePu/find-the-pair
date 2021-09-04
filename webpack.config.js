const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './src/main.js',
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new HtmlWebpackPlugin({
          template: './src/main.html',
          inject: false
      }),
    new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        generateStatsFile: true,
        statsOptions: { source: false }
    }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.(png|jpg)/,
                use: [
                    'file-loader?name=assets/images/[name].[ext]',
                ]
            },
            
            {
                test: /\.(ico)/,
                use: [
                    'file-loader',
                ]
            }
        ]
    }
};