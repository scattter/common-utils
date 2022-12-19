const fs = require('fs')
const shell = require('shelljs')
const YAML = require('yaml')

let readDirs = fs.readdirSync('./scripts');
let allLogs = fs.readFileSync('./logs/all.yml', 'utf8');
let parsedLogs = YAML.parse(allLogs)

// 所有成功执行的脚本数组
let activeScripts = []
Object.values(parsedLogs).forEach(dayLogs => {
  activeScripts = [...activeScripts, ...Object.keys(dayLogs).filter(key => dayLogs[key] === 'success')]
})

// 记录新执行脚本成功与否
let newScripts = {}
const nowDate = shell.exec('date +%Y-%m-%d').trim()

// 写入单独的带有时间信息的yml文件中
readDirs.forEach(dir => {
  const filePath = `./scripts/${dir}`
  const targetPath = `./logs/${nowDate}.yml`
  if (!activeScripts.includes(filePath)) {
    // 执行脚本同时进行结果的保存处理
    execScript(filePath, targetPath)
  }
})


// 写入全部yml记录中
// 更新
if (parsedLogs[nowDate]) {
  parsedLogs[nowDate] = newScripts
  fs.writeFileSync(`./logs/all.yml`, YAML.stringify(parsedLogs))
} else {
  // 新增
  const yamlContext = YAML.stringify({
    [nowDate]: newScripts
  })
  fs.appendFileSync(`./logs/all.yml`, yamlContext)
}

// 脚本处理函数
function execScript(filePath, targetPath) {
  const data = YAML.parse(fs.readFileSync(targetPath, 'utf8'))
  const now = shell.exec('date "+%Y-%m-%d %H:%M:%S"').trim()
  // 判断是否未执行
  if (!data || !data[filePath]) {
    let str = fs.readFileSync(filePath, 'utf8');
    const isSuccess = shell.exec(str).code === 0

    // 新脚本的话直接添加进去
    newScripts[filePath] = isSuccess ? 'success' : 'error'
    const script = {
      [filePath]: {
        status: isSuccess ? 'success' : 'error',
        firstDate: now,
        lastDate: now,
      },
    }
    const yamlContext = YAML.stringify(script) + '\n'
    fs.appendFileSync(targetPath, yamlContext)

    // 如果脚本执行失败, 抛出错误
    if (!isSuccess) {
      shell.echo(`Error: ${filePath} script failed`);
      shell.exit(1)
    }
  } else {
    // 如果是执行之前出错的代码, 那么就对原数据进行修改, 然后重写进yml文件中
    if (data[filePath] && data[filePath].status === 'error') {
      let str = fs.readFileSync(filePath, 'utf8');
      if (shell.exec(str).code === 0) {
        newScripts[filePath] = 'success'
        data[filePath].status = 'success'
        data[filePath].lastDate = now
        const yamlContext = YAML.stringify(data)
        fs.writeFileSync(targetPath, yamlContext)
      } else {
        newScripts[filePath] = 'error'
        shell.echo(`Error: ${filePath} script failed`);
        shell.exit(1)
      }
    }
  }
}
