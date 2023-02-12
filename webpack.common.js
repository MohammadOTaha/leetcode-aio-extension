const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    popup: path.resolve('src/popup/index.tsx'),
    contentScript: path.resolve('src/contentScript/index.tsx'),
    background: path.resolve('src/background/index.ts')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.tsx?$/,
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader', // postcss loader needed for tailwindcss
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [tailwindcss, autoprefixer]
              }
            }
          }
        ]
      },
      {
        type: 'assets/resource',
        test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist'),
          globOptions: {
            ignore: ['**/firebase/**']
          }
        }
      ]
    }),
    new Dotenv(),
    ...getHtmlPlugins(['popup'])
  ],
  resolve: {
    extensions: ['.tsx', '.js', '.ts']
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'contentScript' && chunk.name !== 'background';
      }
    }
  }
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
      })
  );
}
