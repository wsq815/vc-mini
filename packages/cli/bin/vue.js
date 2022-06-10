#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const requestVersion = require('../package.json').engines.node

function checkNodeVersion(wanted, id){
  if(!semver.satisfies(process.version, wanted, { includePrerelease: true })){
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requestVersion, 'vue-cli-mini')

const fs = require('fs')
const path = require('path')
// const slash = require('slash')
const minimist = require('minimist')
const program = require('commander')

program
  .version(`vc-mini ${require('../package').version}`)
  .usage('<command> [options]')
  
program
  .command('create <app-name>')
  .description('create a new project powered by vc-service')
  .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset') //跳过prompt选项直接使用预置的选项
  .option('-f, --force', 'Overwrite target directory if it exists') //覆盖已存在的目标目录
  .option('-d, --default', 'Skip prompts and use default preset') //使用默认的preset
  .option('-i, --inlinePreset <json>', 'Skip prompts and use inline JSON string as preset') //使用JSON字符串作为preset选项
  .action((name, options, command) => {
    if(minimist(process.argv.slice(3))._.length > 1){
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }

    require('../lib/create')(name, options)
  })

program.parse(process.argv);