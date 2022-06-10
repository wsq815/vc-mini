const { defaults } = require('./options')
// const execa = require('execa')
const PromptModuleAPI = require('./PromptModuleAPI')
const chalk = require('chalk')
const inquirer = require('inquirer')

// 判断是否是手动模式
const isManualMode = answers => answers.preset === '__manual__'
module.exports = class Creator{
  constructor (name, context, promptModules) {
    
    this.name = name
    this.context = process.env.VC_CONTEXT = context
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts()

    // 预置的prompt
    this.presetPrompt = presetPrompt
    // 供挑选功能的prompt
    this.featurePrompt = featurePrompt

    this.outroPrompts = []
    // 保存通过PromptModuleAPI类的实例注入的Prompt
    this.injectedPrompts = []
    // 保存prompt的回调函数
    this.promptCompleteCbs = []
    this.afterInvokeCbs = []
    this.afterAnyInvokeCbs = []

    this.run = this.run.bind(this)
    
    // PromptModuleAPI注入this即当前Creator实例，promptModules是一个方法数组，每个方法提供一个参数,
    // 该参数是一个PromptModuleAPI实例，该方法被调用时将执行PromptModuleAPI的方法，从而将feature、prompt、cb
    // 保存到featurePrompt、injectedPrompts、promptCompleteCbs中
    // promptModules是通过rquire promptModules文件夹里面的文件获得的，每个文件都规范的导出一个接收PromptModuleAPI实例的方法
    const promptAPI = new PromptModuleAPI(this)
    promptModules.forEach(m => m(promptAPI))
  }
  async create(cliOption = {}, preset = null){
    const {run, name, context, afterInvokeCbs, afterAnyInvokeCbs} = this

    if(!preset){
      if(cliOption.preset){
        // vc-mini create foo --preset bar
        preset = await this.resolvePreset()
      }else if(cliOption.default){
        // vc-mini create foo --default
        preset = defaults.presets['Default (Vue 3)']
      }else if(cliOption.inlinePreset){
        // vue create foo --inlinePreset {...}
        try {
          preset = JSON.parse(cliOptions.inlinePreset)
        } catch (error) {
          console.log(chalk.red(`CLI inline preset is not valid JSON: ${cliOptions.inlinePreset}`))
          exit(1)
        }
      }else {
        preset = await this.promptAndResolvePreset()
      }
    }
  }
  
  run (command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    // return execa(command, args, { cwd: this.context })
  }
  async promptAndResolvePreset(answers = null){
    // prompt
    if(!answers){
      answers = await inquirer.prompt(this.resolveFinalPrompts())
    }
    console.log(chalk.green(`answers:${JSON.stringify(answers)}`))
  }
  // 解析preset
  async resolvePreset(){}
  // 获取预置options信息
  getPresets(){
    return Object.assign({}, defaults.presets)
  }
  // 解析脚手架内置的prompts
  resolveIntroPrompts(){
    const presets = this.getPresets()
    const presetChoices = Object.entries(presets).map(([name, preset]) => {
      let displayName = name
      // Vue version will be showed as features anyway,
      // so we shouldn't display it twice.
      if (name === 'Default (Vue 2)' || name === 'Default (Vue 3)') {
        displayName = 'Default'
      }

      return {
        name: `${displayName} (${preset.vueVersion})`,
        value: name
      }
    })
    const presetPrompt = {
      name: 'preset',
      type: 'list',
      message: `Please pick a preset:`,
      choices: [
        ...presetChoices,
        {
          name: 'Manually select features',
          value: '__manual__'
        }
      ]
    }
    const featurePrompt = {
      name: 'features',
      when: isManualMode,
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
      pageSize: 10
    }
    return {
      presetPrompt,
      featurePrompt
    }
  }
  resolveFinalPrompts(){
    // patch generator-injected prompts to only show in manual mode
    this.injectedPrompts.forEach(prompt => {
      const originalWhen = prompt.when || (() => true)
      prompt.when = answers => {
        return isManualMode(answers) && originalWhen(answers)
      } 
    })

    const prompts = [
      this.presetPrompt,
      this.featurePrompt,
      ...this.injectedPrompts
    ]
    console.log(chalk.blue(`vc-mini:prompts---${JSON.stringify(prompts)}`))
    return prompts
  }
  resolveOutroPrompts(){
    
  }
}