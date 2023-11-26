import { parse } from '@babel/parser';
import traverseOrigin from '@babel/traverse'
import fs from 'fs-extra'
import { glob } from 'glob';
import path from 'path';

/**
 * ast遍历函数
 */
const traverse =
  typeof traverseOrigin=== 'function'
  ? traverseOrigin
  : traverseOrigin.default;

const workspace = process.cwd();

/**
 * 全局变量
 */
const chain = []
const callerChain = new Map()

/**
 * 解析文件依赖的集合
 * @param code: 文件内容
 * @returns {Set<{ moduleName: string, line: number }>}: 依赖集合
 */
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
        line: path.node.loc.start.line ?? 1,
      })
    }
  })
  return moduleNameSet
}

/**
 * 获取依赖的绝对地址
 * @param moduleName: 依赖(如'./xx.js')
 * @param sourceFile: 源文件(如'entry.js')
 * @returns {string}: 绝对地址(如'/Users/xx/project-1/xx.js')
 */
const getOriginPath = (moduleName, sourceFile) => {
  // 相对径路文件
  const dir = path.dirname(sourceFile.moduleName);
  return path.resolve(dir, moduleName);
}

/**
 * 递归查找循环依赖
 * @param file: 入口文件
 * @param chain: 依赖链(包含当前文件)
 * @returns {void}: 当找到循环依赖时, 会将依赖链存入callerChain, 退出循环
 */
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
  // 如果没有依赖, 则退出
  if (!moduleNameSet.size) return;

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
    const files = await glob(`${workspace}/**/entry.js`, {
      ignore: ['**/node_modules/**'],
    })

    for (const file of files) {
      // 查找循环依赖
      await findCycleModule({
        moduleName: file,
        line: 1,
      }, [])
    }

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