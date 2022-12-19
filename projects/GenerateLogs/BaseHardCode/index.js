const fs = require('fs')
const shell = require('shelljs')
const YAML = require('yaml')

let readDirs = fs.readdirSync('./scripts');
let logs = fs.readFileSync('./logs.yml', 'utf8');
let parsedLogs = YAML.parse(logs)

readDirs.forEach(dir => {
  const filePath = `./scripts/${dir}`
  const now = shell.exec('date "+%Y-%m-%d %H:%M:%S"')

  // 判断是否未执行
  if (!parsedLogs || !parsedLogs[filePath]) {
    let str = fs.readFileSync(filePath, 'utf8');
    const isSuccess = shell.exec(str).code === 0

    // 新脚本的话直接添加进去
    const script = {
      [filePath]: {
        status: '|' + isSuccess ? 'success' : 'error',
        firstDate: now,
        lastDate: now,
      },
    }
    const yamlContext = YAML.stringify(script) + '\n'
    fs.appendFileSync('./logs.yml', yamlContext)

    // 如果脚本执行失败, 抛出错误
    if (!isSuccess) {
      shell.echo(`Error: ${filePath} script failed`);
      shell.exit(1)
    }
  } else {
    // 如果是执行之前出错的代码, 那么就对原数据进行修改, 然后重写进yml文件中
    if (parsedLogs[filePath] && parsedLogs[filePath].status === 'error') {
      let str = fs.readFileSync(filePath, 'utf8');
      if (shell.exec(str).code === 0) {
        parsedLogs[filePath].status = 'success'
        parsedLogs[filePath].lastDate = now
        const yamlContext = YAML.stringify(parsedLogs)
        fs.writeFileSync('./logs.yml', yamlContext)
      } else {
        shell.echo(`Error: ${filePath} script failed`);
        shell.exit(1)
      }
    }
  }
})
