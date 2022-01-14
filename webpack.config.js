const path = require('path');
const fs = require('fs');
let package = JSON.parse(fs.readFileSync('package.json'));
//console.log(package);

module.exports = (env, argv) => {
    let fileExt = (argv.mode === 'production') ? '.min.js' : '.js'

    return {
        entry: {
            index: './index.js'
        },
        output: {
            //filename: '[name].js',
            filename: package.name+fileExt,
            path: path.resolve(__dirname, 'build'),
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            "postcss-preset-env",
                                            {
                                                // Options
                                            },
                                        ],
                                        [
                                            "autoprefixer",
                                            {
                                                // Options
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        "style-loader",
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            "postcss-preset-env",
                                            {
                                                // Options
                                            },
                                        ],
                                        [
                                            "autoprefixer",
                                            {
                                                // Options
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                    ],
                },
            ],
        }
    };
};
