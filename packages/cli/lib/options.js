
exports.defaultPreset = {
  useConfigFiles: false,
  cssPreprocessor: undefined,
  plugins: {
    '@vue/cli-plugin-babel': {},
    '@vue/cli-plugin-eslint': {
      config: 'base',
      lintOn: ['save']
    }
  }
}

exports.defaults = {
  lastChecked: undefined,
  latestVersion: undefined,

  packageManager: undefined,
  useTaobaoRegistry: undefined,
  presets: {
    'Default (Vue 3)': Object.assign({ vueVersion: '3' }, exports.defaultPreset),
    'Default (Vue 2)': Object.assign({ vueVersion: '2' }, exports.defaultPreset)
  }
}