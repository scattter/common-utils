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
      moduleNameSet.add(path.node.source.value)
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
  const dir = path.dirname(sourceFile);
  return path.resolve(dir, moduleName);
}

// 查找循环依赖
const findCycleModule = async (file, chain) => {
  if (chain.includes(file)) {
    callerChain.set(file, [...chain, file])
    return
  }

  if (callerChain && callerChain.has(file)) {
    return
  }

  const originPath = new Set()
  // 读取入口文件
  const code = await fs.readFile(file, 'utf-8')
  // 解析入口文件
  const moduleNameSet = parseFile(code)

  // 递归解析依赖, 寻找源地址
  for (const moduleName of moduleNameSet) {
    const modulePath = getOriginPath(moduleName, file)
    originPath.add(modulePath)
  }

  // 查找循环依赖
  for (const cFile of originPath) {
    await findCycleModule(cFile, [...chain, file])
  }
}

const handleFile = async () => {
  try {
    // 查找入口
    const files = await glob(`${workspace}/project-1/**/entry.js`)

    // 查找循环依赖
    await findCycleModule(files[0], [])

    // 打印循环依赖信息
    console.log(callerChain)
  } catch (e) {
    console.log(e)
  }
}

handleFile().then(r => console.log(r))