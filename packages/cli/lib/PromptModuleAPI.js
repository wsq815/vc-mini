module.exports = class PromptModuleAPI {
  constructor(creator){
    this.creator = creator
  }

  // 注入功能
  injectFeature (feature) {
    this.creator.featurePrompt.choices.push(feature)
  }

  // 注入prompt
  injectPrompt(prompt){
    this.creator.injectedPrompts.push(prompt)
  }

  // 通过name找到prompt并为其注入option
  injectOptionForPrompt(name, option){
    this.creator.injectedPrompts.find(f => {
      return f.name = name
    }).choices.push(option)
  }

  onPromptComplete(cb){
    this.creator.promptCompleteCbs.push(cb)
  }
}