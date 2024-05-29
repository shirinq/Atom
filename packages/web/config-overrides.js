const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

// our packages that will now be included in the CRA build step
const appIncludes = [
  resolveApp('src'),
  resolveApp('../component/src'),
]

module.exports = function override(config, env) {
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== 'ModuleScopePlugin'
  )
  config.module.rules[0].include = appIncludes
  // config.module.rules[1] = null
  config.module.rules[1].oneOf[1].include = appIncludes
  config.module.rules[1].oneOf[3].options.plugins = [
    require.resolve('babel-plugin-react-native-web'),
  ].concat(config.module.rules[1].oneOf[3].options.plugins)

  config.module.rules.push({
    test: /\.js$/,
    exclude: /(@babel(?:\/|\\{1,2})runtime|node_modules[/\\](?!react-native.))/,
    // exclude: /node_modules[/\\](?!react-native-awesome-alerts)(?!react-native-document-picker)(?!react-native-dropdownalert)(?!react-native-gesture-handler)(?!react-native-keyboard-aware-scroll-view)(?!react-native-linear-gradient)(?!react-native-material-dropdown)(?!react-native-material-buttons)(?!react-native-material-ripple)(?!react-native-material-textfield)(?!react-native-orientation-locker)(?!react-native-persian-calendar-picker)(?!react-native-swipe-list-view)(?!react-native-switch)(?!react-native-webview)(?!react-navigation)(?!react-native-dropdown-picker)(?!react-native-modern-datepicker)/,
    use: {
      loader: "babel-loader",
      options: {
        // Disable reading babel configuration
        babelrc: false,
        configFile: false,

        // The configuration for compilation
        presets: [
          // ["@babel/preset-env", { useBuiltIns: "usage" }],
          "@babel/preset-react",
          "@babel/preset-flow",
          "@babel/preset-typescript",
          "module:metro-react-native-babel-preset"
        ],
        plugins: [
          "@babel/plugin-proposal-class-properties",
          "@babel/plugin-proposal-object-rest-spread"
        ]
      }
    },
  })

  config.module.rules = config.module.rules.filter(Boolean)

  return config
}
