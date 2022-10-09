const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const fs = require("fs");
const path = require('path');
const YAML = require("yaml");
const configFile = fs.readFileSync("./_config.yml", "utf8");
const configSite = YAML.parse(configFile);

module.exports = {
  entry: {
    main: { import: "./_js/main.js", filename: "js/[name].min.js" },
  },
  output: {
    path: path.resolve(__dirname),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename:  path.resolve(__dirname, '_includes', '_pwa.html'),
      templateContent: ({ htmlWebpackPlugin }) => {
        const timestamp = Date.now();
        return `${htmlWebpackPlugin.tags.headTags
          .filter(({ meta }) => meta.plugin === "favicons-webpack-plugin")
          .map((headTag) => {
            "href" in headTag.attributes
              ? (headTag.attributes.href =
                  headTag.attributes.href + "?" + timestamp)
              : null;
            return headTag;
          })}`;
      },
    }),
    new FaviconsWebpackPlugin({
      inject: true,
      logo: path.resolve(__dirname, 'images', configSite.logo),
      prefix: "",
      outputPath: path.resolve(__dirname,  'icons'),
      publicPath: "/icons",
      favicons: {
        appName: configSite.title,
        appShortName: configSite.short_name,
        appDescription: configSite.description,
        lang: "pl-PL",
        background: "#fff",
        theme_color: configSite.theme_color,
        manifestMaskable: true,
        icons: {
          appleStartup: false,
        },
      },
    }),
    new WorkboxPlugin.GenerateSW({
      exclude: [/.*_includes\/.*/],
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-webfonts'
          }
        },
        { 
          urlPattern: /images/,
          handler: 'CacheFirst',
          options: {
            expiration: { maxEntries: 10 },
            cacheName: 'images',
          },
        },
      ]
    })
  ],
};
