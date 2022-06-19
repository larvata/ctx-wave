// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const sharp = require('sharp');
const pkg = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
const stylesHandler = MiniCssExtractPlugin.loader;

// v3: chrome, edge
// v2: firefox, safari
const targetManifestVersion = (process.env.MANIFEST_VERSION === '2')
  ? 2
  : 3;

const pluginResizeAndCopyIcons = () => {
  const METADATA = [{
    name: 'app-icon-16',
    size: 16,
  }, {
    name: 'app-icon-48',
    size: 48,
  }, {
    name: 'app-icon-64',
    size: 64,
  }, {
    name: 'app-icon-128',
    size: 128,
  }];

  return METADATA.map((md) => ({
    from: 'src/public/images/icon.png',
    to: `icons/${md.name}.png`,
    transform: (content) => sharp(content).resize(md.size).toBuffer(),
  }));
};

const pluginCreateManifests = () => {
  const METADATA = [{
    version: targetManifestVersion,
    default: true,
  }];

  const buildManifest = (content, targetVersion) => {
    const manifest = JSON.parse(content.toString());
    manifest.version = pkg.version;

    if (targetVersion === 2) {
      manifest.manifest_version = 2;
      manifest.version = pkg.version;
      manifest.permissions = [...manifest.permissions, ...manifest.host_permissions];
      delete manifest.host_permissions;
      manifest.browser_action = manifest.action;
      manifest.browser_action.default_icon = manifest.icons;
      delete manifest.action;
      manifest.background.scripts = [].concat(manifest.background.service_worker);
      delete manifest.background.service_worker;
    } else if (targetVersion === 3) {
      // nope
    }

    return JSON.stringify(manifest, null, 2);
  };

  return METADATA.map((md) => ({
    from: './src/manifest.json',
    to: (md.default ? 'manifest.json' : `manifests/manifest.v${md.version}.json`),
    transform: (content) => buildManifest(content, md.version),
  }));
};

const config = {
  entry: {
    background: './src/background.js',
    popup: './src/components/Popup',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
  },

  devServer: {
    open: true,
    host: 'localhost',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['popup'],
      filename: 'popup.html',
      templateContent:
`<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Wave for Surge Extension Popup</title>
        <script src="vendors/react.production.min.js"></script>
        <script src="vendors/react-dom.production.min.js"></script>
        <script src="vendors/mercury.web.js"></script>
    </head>
    <body>
      <div id="root" />
    </body>
</html>`,
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/_locales',
          to: '_locales',
        },
        {
          from: './src/public/vendors',
          to: 'vendors',
        },
        ...pluginCreateManifests(),
        ...pluginResizeAndCopyIcons(),
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },

  devtool: 'cheap-module-source-map',

  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    'mercury-parser': 'window.Mercury',
  },
};

module.exports = () => {
  config.mode = isProduction ? 'production' : 'development';
  return config;
};
