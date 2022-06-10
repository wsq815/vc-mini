exports.getPromptModules = () => {
  return [
    'router',
    'vuex',
  ].map(file => require(`../promptModules/${file}`))
}
