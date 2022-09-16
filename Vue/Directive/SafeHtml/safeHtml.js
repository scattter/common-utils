// 主要代码来自组内组长, 我在上面做了部分修改和注释
// 处理非法html
function assert(isOK, msg) {
  if (!isOK) {
    throw new Error(msg)
  }
}

// 使用类的方式将变量储存在类内部
function TextParser(sText) {
  let sCurText = sText
  let prefix = ''
  let matcher

  return {
    // 用来匹配标签和属性的函数
    match: (reg, msg) => {
      matcher = sCurText.match(reg)
      // 用来确保输入的html是有效的, 暂不处理非法html
      assert(null !== matcher, msg)
      if (matcher.index === 0) {
        prefix = ''
        return
      }
      prefix = sCurText.substring(0, matcher.index)
      // 使用数据流的模式, 通过更新sCurText逐次向后解析
      sCurText = sCurText.substring(matcher.index)
    },
    // 匹配后获取匹配值, 如tagName或者是attrName
    getPreText: () => prefix,
    getToken: () => matcher[0],
    // 用来跳过=和引号这些  然后保存具体的属性值
    skip: n => {
      const skipStr = sCurText.substring(0, n)
      sCurText = sCurText.substring(n)
      return skipStr
    },
    // 解析到最后一个字符, 将剩余的字符存入store, 清空sCurText
    end: () => {
      const sText = sCurText
      sCurText = ''
      return sText
    },
    // 判断字符解析流是否结束
    isEnd: () => !sCurText,
  }
}

// 保存处理解析后的字符流
function Store() {
  const _data = []
  return {
    save: str => {
      if (str !== '') {
        _data.push(str)
      }
    },
    getText: () => _data.join(''),
  }
}

// 获取属性的值
function getAttrValue(parser) {
  // 跳过单引号或者双引号
  const startChar = parser.skip(1)
  let attrValue = startChar
  // 开始解析具体的属性值
  let char = parser.skip(1)
  // 如果当前字符不等于单引号或者双引号
  // 或者其他和首字符匹配的关闭符(如{}), 那就继续解析
  while(char && char !== startChar) {
    attrValue += char
    char = parser.skip(1)
    // 处理属性值里面的引号(肯定是转义过的, 如style="background: 'black'")
    if (char === '\\') {
      attrValue += char
      char = parser.skip(1)
    }
  }
  attrValue += char // =''''

  return attrValue
}

// 移除script
function filterScriptTag(sHtml) {
  const splitList = sHtml.split(/(<script[^>]*>|<\/script[^>]*>)/)
  // 删除script代码
  return splitList.map((text, index) => {
    // 判断是否是script
    if (text.startsWith('<script')) {
      return ''
    }
    if (text.startsWith('<\/script')) {
      return ''
    }
    const pre = splitList.slice(index).indexOf('<script>')
    const lst = splitList.slice(index).indexOf('</script>')
    // 情况1: 剩余字符串里面只有尾</script>, 那么就清空
    // 情况2: 剩余字符串里面头和尾都有, 且</script>在<script>前面, 也清空
    // 其他情况都正常返回
    const shouldCleanText = (pre === -1 && lst !== -1) || (pre > lst && lst !== -1)
    // 利用类似有效字符串的原理, 移除script里面的文本
    if (shouldCleanText) {
      return ''
    }
    return text
  }).filter(text => !!text).join('')
}

// const demo = `<script><h1>sfdsf</h1></script><script><h2 style="background: 'black'">sfdsf</h2><script></h2>---=dsf</script><script><h3>sfdsf</h3></script>`
// const re = filterScriptCode(demo)
// // console.log('源文本', demo)
// console.log('处理后', re)

function filterScriptCode(sHtml) {
  // 移除script标签
  let sHtmlCode = filterScriptTag(sHtml)
  if (-1 === sHtmlCode.indexOf('<')) {
    // 纯文档，没有HTML标签，直接返回，不用处理
    return sHtmlCode
  }

  // 删除HTML标签中的事件
  const store = Store()
  const parser = TextParser(sHtmlCode);
  // 开始匹配 解析第一个html标签, 使用<括号进行解析
  parser.match(/</)
  // 如果是<h2..., 那么保存的是空, 如果是abc<h2..., 那么保存的是abc
  store.save(parser.getPreText())

  // return
  // 这里开始进行解析, 直到字符串结束
  while (!parser.isEnd()) {
    // 查看html 的 tag, 以及验证是否有效 (那这里如果无效的话就会报错)
    // 找到后将其存入store, 如(<h2>里面的>和/)  这个正则识别不出来<h2sfdsf</h2>的错误语法 需要再判断下
    parser.match(/[\s/>]+/, `${parser.getPreText()} is not closed tag`)
    store.save(parser.getPreText()) // save tag name

    let sToken = parser.getToken()
    if (sToken.includes('/')) {
      const pre = parser.getPreText()
      // 除了:  1. store里面最后一个是有效的> 2. /前的字符串里面含有>
      // 这两种情况外, 其余都是无效html, 抛出错误
      if (!(pre.indexOf('>') !== -1 || store.getText()[-1] !== '>')) throw new Error(`${pre} is not closed tag`)
      // 如果匹配到的选项里面有闭合符, 那么就代表这个tag结束了
      // 然后去寻找闭合符后面的tag(如<img />), 找到后将其保存到store
      parser.match(/>/)
      store.save(parser.getPreText())
    } else while (!sToken.includes('>')) {
      // skip space before attribute name
      // 这里处理解析到空格的情况 然后将空格前的字符
      // 如<h2 style="1111">sfdsf</h2>里面的<h2
      parser.match(/[^\s]+/)
      store.save(parser.getPreText())

      // parse attributes
      // 解析=, 如果既没有=也没有/结尾符, 那么这是个错误定义的属性
      parser.match(/[\s=/>]+/, 'attribute is error') // attribute name
      sToken = parser.getToken()
      // 如果解析到=, 获取=前面的属性名
      const attrName = parser.getPreText()
      if (!attrName) {
        // tag结束了
        continue
      }

      let attrStr = attrName
      if (parser.getToken().includes('=')) {
        // save "="
        attrStr += parser.getToken()
        // 字符流跳过=符号
        parser.skip(parser.getToken().length)

        // save attribute value
        // 保存属性具体的值
        attrStr += getAttrValue(parser)
      }

      // skip events
      if (!attrName.toLowerCase().startsWith('on')) {
        store.save(attrStr)
      }
    }

    try {
      // 开始新的解析, 同事保存>前面的字符
      parser.match(/</)
      sToken = parser.getToken()
      store.save(parser.getPreText())
    } catch {
      // the end
      store.save(parser.end())
    }
  }

  return store.getText()
}

const safeHtml = {
  bind(el, binding, vnode) {
    el.innerHTML = filterScriptCode(binding.value)
  }
}

export default safeHtml