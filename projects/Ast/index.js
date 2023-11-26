import { parse } from '@babel/parser';
import traverseOrigin from '@babel/traverse'
import fs from 'fs-extra'
import { glob } from 'glob';
import path from 'path';

const traverse =
  typeof traverseOrigin=== 'function'
  ? traverseOrigin
  : traverseOrigin.default;

const workspace = process.cwd();

const chain = []
const callerChain = new Map()

// 解析文件, 获取导入导出的模块名/路径
const parseFile = (code) => {
  const moduleNameSet = new Set()
  // 解析入口文件
  const ast = parse(code, {
    sourceType: 'module',
  })
  traverse(ast, {
    ImportDeclaration(path) {
      moduleNameSet.add({
        moduleName: path.node.source.value,
        line: path.node.loc.start.line,
      })
    }
  })
  return moduleNameSet
}

const getOriginPath = (moduleName, sourceFile) => {
  // if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
  //   return `${workspace}/project-1/${moduleName}`
  //
  // }
  // 相对径路文件
  const dir = path.dirname(sourceFile.moduleName);
  return path.resolve(dir, moduleName);
}

// 查找循环依赖
const findCycleModule = async (file, chain) => {
  const {moduleName, line} = file
  const pureChain = chain.map((item) => item.moduleName)
  if (pureChain.includes(moduleName)) {
    callerChain.set(moduleName, [...chain, file])
    return
  }

  if (callerChain && callerChain.has(moduleName)) {
    return
  }

  const originPath = new Set()
  // 读取入口文件
  const code = await fs.readFile(moduleName, 'utf-8')
  // 解析入口文件
  const moduleNameSet = parseFile(code)

  // 递归解析依赖, 寻找源地址
  for (const module of moduleNameSet) {
    const {moduleName, line} = module
    const originModuleName = getOriginPath(moduleName, file)
    originPath.add({
      moduleName: originModuleName,
      line,
    })
  }

  // 递归到当前文件内部, 查找循环依赖
  // 递归时初始文件行数要更改为当前module的行数
  for (const cFile of originPath) {
    await findCycleModule(cFile, [...chain, {
      moduleName: file.moduleName,
      line: cFile.line,
    }])
  }
}

const handleFile = async () => {
  try {
    // 查找入口
    const files = await glob(`${workspace}/project-1/**/entry.js`)

    // 查找循环依赖
    await findCycleModule({
      moduleName: files[0],
      line: 1,
    }, [])

    // 打印循环依赖信息
    for (const [key, value] of callerChain) {
      console.log('循环依赖存在于文件: ', key)
      console.log('依赖链: ')
      value.forEach((item) => {
        console.log(`---> ${item.moduleName}: ${item.line}`)
      })
      console.log('\n')
    }
  } catch (e) {
    console.log(e)
  }
}

handleFile().then(r => console.log(r))