# mini-vue-cli

### 
使用lerna管理repo（多包）项目
初始化lerna init

代码结构如下
lerna-repo/
  packages/
  package.json
  lerna.json

创建一个包 lerna create cli 嫌麻烦跳过prompt可添加--yes option 即lerna create cli --yes


"bin": {
  "vc-mini2": "bin/vue.js"
},
为方便代码调试在package.json指定bin字段之后在包的根目录执行npm script 即可在命令行vc-mini2
注意 vue.js文件头部要加上#!/usr/bin/env node

/bin/vue.js
第一步先校验当前node版本是否与项目所需的版本相符合：
在package.json里面定义node所需版本，并拿到它
  "engines": {
    "node": "^12.0.0 || >= 14.0.0"
  }, 

通过过process.version拿到当前使用的node版本

安装sermver版本对比工具库 lerna add semver -D package/cli 
安装commander、minimist

第二步拦截命令行参数，根据命令行参数做相应处理，我们只拦截create逻辑


/lib/create.js

定义create方法 主要处理项目名称是 . 或 当前目录已有跟项目名称同名的目录
当项目名称是 . 的时候获取到当前目录名称然后通过prompt选择是否在当前目录创建项目
当前目名称跟当前目录的某个目录同名时的处理

最后开始调用Creator类创建creator实例开始创建项目



