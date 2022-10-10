// 给定一个经过编码的字符串，返回它解码后的字符串。
// s = "3[a]2[bc]", 返回 "aaabcbc"；s = "3[a2[c]]", 返回 "accaccacc"；s = "2[abc]3[cd]ef", 返回 "abcabccdcdcdef"。

const decode = (strs) => {
  const numStack = [], strStack = []
  let num = 0, result = ''

  for(let i = 0; i < strs.length; i++) {
    const cur = strs[i]
    if(!isNaN(cur)) {
      if(i - 1 >= 0 && !isNaN(strs[i - 1])) {
        num = parseInt(num + cur)
      } else {
        num = parseInt(cur)
      }
    } else if (cur === '[') {
      numStack.push(num)
      num = 0
      strStack.push(result)
      result = ''
    } else if (cur === ']') {
      const repeatTime = numStack.pop()
      result = strStack.pop() + result.repeat(repeatTime)
    } else {
      result += cur
    }
  }
  return result
}

const s = '2[abc]3[cd]ef'
console.log(decode(s))