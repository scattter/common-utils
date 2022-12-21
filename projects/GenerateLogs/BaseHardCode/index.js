const fs = require('fs')
const shell = require('shelljs')
const YAML = require('yaml')

const DEFAULT_SCRIPTS_PATH = './scripts'
const DEFAULT_LOGS_PATH = './logs'
const DEFAULT_SUMMARY_LOG_PATH = '/all.yml'
const DEFAULT_READ_FILE_OPTION = {
  flag: 'a+',
  encoding: 'utf8'
}

// 脚本处理函数
function execScript(filePath, targetPath, newScripts, ...options) {
  const { readFileOption = DEFAULT_READ_FILE_OPTION } = options || {}
  const data = YAML.parse(fs.readFileSync(targetPath, readFileOption))
  const now = shell.exec('date "+%Y-%m-%d %H:%M:%S"').trim()
  // 判断是否未执行
  if (!data || !data[filePath]) {
    const script = fs.readFileSync(filePath, readFileOption);
    const isSuccess = shell.exec(script).code === 0

    // 新脚本的话直接添加进去
    newScripts[filePath] = isSuccess ? 'success' : 'error'
    const result = {
      [filePath]: {
        status: isSuccess ? 'success' : 'error',
        firstDate: now,
        lastDate: now
      },
    }
    const yamlContext = YAML.stringify(result)
    fs.appendFileSync(targetPath, yamlContext)

    // 如果脚本执行失败, 抛出错误
    if (!isSuccess) {
      shell.echo(`Error: ${filePath} script failed`);
    }
  } else {
    // 如果是执行之前出错的代码, 那么就对原数据进行修改, 然后重写进yml文件中
    if (data[filePath] && data[filePath].status === 'error') {
      const script = fs.readFileSync(filePath, readFileOption);
      if (shell.exec(script).code === 0) {
        newScripts[filePath] = 'success'
        data[filePath].status = 'success'
        data[filePath].lastDate = now
        const yamlContext = YAML.stringify(data)
        fs.writeFileSync(targetPath, yamlContext)
      } else {
        newScripts[filePath] = 'error'
        shell.echo(`Error: ${filePath} script failed`);
      }
    }
  }
}

// 生成log
function generateLogs(logsFolderPath = DEFAULT_LOGS_PATH, scriptsFolderPath = DEFAULT_SCRIPTS_PATH, ...options) {
  const { summaryLogPath = `${logsFolderPath}${DEFAULT_SUMMARY_LOG_PATH}`, readFileOption = DEFAULT_READ_FILE_OPTION } = options || {}
  let readDirs = fs.readdirSync(scriptsFolderPath);
  let allLogs = fs.readFileSync(summaryLogPath, readFileOption);
  let parsedLogs = YAML.parse(allLogs)

// 所有成功执行的脚本数组
  let activeScripts = []
  if (parsedLogs) {
    Object.values(parsedLogs).forEach(dayLogs => {
      activeScripts = [...activeScripts, ...Object.keys(dayLogs).filter(key => dayLogs[key] === 'success')]
    })
  }

  // 记录新执行脚本成功与否
  let newScripts = {}
  const nowDate = shell.exec('date +%Y-%m-%d').trim()

  // 写入单独的带有时间信息的yml文件中
  readDirs.forEach(dir => {
    const filePath = `${scriptsFolderPath}/${dir}`
    const targetPath = `${logsFolderPath}/${nowDate}.yml`
    if (!activeScripts.includes(filePath)) {
      // 执行脚本同时进行结果的保存处理
      execScript(filePath, targetPath, newScripts)
    }
  })

  // 写入全部yml记录中
// 更新
  if (parsedLogs && parsedLogs[nowDate]) {
    // 更新所有本次执行脚本的执行结果
    Object.keys(newScripts).map(key => {
      parsedLogs[nowDate][key] = newScripts[key]
    })
    fs.writeFileSync(summaryLogPath, YAML.stringify(parsedLogs))
  } else {
    // 本次执行脚本之前从未执行过, 因此进行新增
    const yamlContext = YAML.stringify({
      [nowDate]: newScripts
    })
    fs.appendFileSync(summaryLogPath, yamlContext)
  }
}

module.exports = generateLogs