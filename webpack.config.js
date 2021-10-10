const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        main: './src/main.js',
        service_worker: './src/service_worker.js'
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new HtmlWebpackPlugin({
          favicon: './src/assets/flaticon.ico',
          template: './src/main.html',
          inject: false
      }),
    // new BundleAnalyzerPlugin({
    //     analyzerMode: 'server',
    //     generateStatsFile: true,
    //     statsOptions: { source: false }
    // }),
    ],
    output: {
        filename: '[name].js',
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
                test: /(images)(.+)\.(png|jpg)$/,
                use: [
                    'file-loader?name=assets/images/[name].[ext]',
                ]
            },
            {
                test: /(icons)(.+)\.(png|jpg)$/,
                use: [
                    'file-loader?name=assets/icons/[name].[ext]',
                ]
            },
            {
                test: /\.ico$/,
                use: [
                    'file-loader',
                ]
            },
            {
                test: /\.json$/,
                loader: 'file-loader',
                type: 'javascript/auto',
                options: {
                  name() {
                    return '[name].[ext]';
                  },
                },
            },
            {
              test: /\.html$/,
              use: 'raw-loader',
            },
        ]
    }
};