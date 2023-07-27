// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';


const config = {
    entry: {
        login:'./web/pages/login/login.js',
        sheet: './web/pages/sheet/sheet.js',
        characters:'./web/pages/characters/characters.js',
        creation:'./web/pages/creation/creation.js'
    },
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        filename: '[name].js'
    },
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /\.css$/i,
                use: ["css-loader"],
              },
              {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  {
                    loader: "sass-loader",
                    options: {
                      sassOptions: {
                        includePaths: [path.resolve(__dirname, "./assets")]
                      },
                    },
                  },
                ]},
                {
                  test: /\.m?js$/,
                  enforce: 'pre',
                  use: ['source-map-loader'],
                },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
