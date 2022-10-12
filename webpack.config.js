const TerserPlugin = require("terser-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const configFile = fs.readFileSync("./_config.yml", "utf8");
const configSite = YAML.parse(configFile);

module.exports = {
  entry: {
    main: { import: "./_javascript/main.js", filename: "bundle.min.js" },
  },
  output: {
    path: path.resolve(__dirname, 'js'),
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename: path.resolve(__dirname, "_includes", "_icons.html"),
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
      logo: path.resolve(__dirname, "images", configSite.logo),
      prefix: "",
      outputPath: path.resolve(__dirname, "icons"),
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
          android: { offset: 10, background: "#fff" },
          appleStartup: false,
          favicons: false,
        },
      },
    }),
    new FaviconsWebpackPlugin({
      inject: true,
      logo: path.resolve(__dirname, "images", "favicon.png"),
      prefix: "",
      outputPath: path.resolve(__dirname, "icons"),
      publicPath: "/icons",
      favicons: {
        icons: {
          appleStartup: false,
          windows: false,
          yandex: false,
          android: false,
          appleIcon: false,
        },
      },
    }),
    new WorkboxPlugin.GenerateSW({
      exclude: [/.*_includes\/.*/, /icons/],
      clientsClaim: true,
      skipWaiting: true,
      swDest: path.resolve(__dirname, 'service-worker.js'),
      modifyURLPrefix: {
        '': '/js/',
      },
      runtimeCaching: [
        {
          urlPattern:
            /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
          handler: "StaleWhileRevalidate",
          options: {
            expiration: { maxEntries: 10 },
            cacheName: "assets",
          },
        },
        {
          urlPattern: /(js\/|\.html)/,
          handler: "CacheFirst",
          options: {
            expiration: { maxEntries: 10 },
            cacheName: "statics",
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "google-fonts-webfonts",
          },
        },
        {
          urlPattern: /^https:\/\/maxcdn\.bootstrapcdn\.com/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "bootstrapcdn-webfonts",
          },
        },
      ],
    }),
    new RemovePlugin({
      before: {
        test: [
          {
              folder: './',
              method: (absoluteItemPath) => {
                  return new RegExp(/workbox-\w+\.js$/, 'm').test(absoluteItemPath)
              }
          },
        ]
      },
    })
  ],
};
