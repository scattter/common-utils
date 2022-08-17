// 可参考下面文章
// https://zh.javascript.info/closure
// 闭包: 在一个函数内可以访问并使用外部变量的函数.
// 其实现方式基于函数创建时默认的[[Environment]]隐藏属性
// 记忆其词法环境, 并更新此法环境

// 普通闭包
function sum() {
  let count = 0
  return function() {
    return count++
  }
}


const demo1 = sum()
const demo2 = sum()
console.log(demo1 === demo2)

const res1 = demo1()
const res2 = demo1()
console.log(res1)
console.log(res2)

// 使用闭包缓存随机数
function sameNumber() {
  let num = Math.random()
  return function () {
    // 如果内部对num进行处理那就不会有缓存了, 如 num++
    return num
  }
}
const num = sameNumber()
const num1 = num()
const num2 = num()
const num3 = num()
console.log(num1, num2, num3)


// 使用闭包扩展函数
// 这个其实有些麻烦了, 此外其有点类似于柯里化高阶函数(lodash里面的curry)
function make_pow(n) {
  return function (x) {
    return Math.pow(x, n);
  }
}
const pow2 = make_pow(2)
const pow3 = make_pow(3)
console.log(pow2(2))
console.log(pow3(3))


// 使用闭包实现函数柯里化add(1)(2)(3) = 6
function add(x) {
  let sum = x
  let temp = function(y) {
    sum += y
    return temp
  }
  temp.toString = function () {
    return sum
  }
  return temp
}

console.log(add(1)(2)(3).toString())
console.log(add(1)(2)(3)(4).toString())

// 类相关示例
class Calculator {
  constructor(num) {
    this.num = num
    this.isFirstCal = true
  }

  add(value) {
    this.destroy()
    this.num += value
    return this
  }

  substract(value) {
    this.destroy()
    this.num -= value
    return this
  }

  result() {
    console.log(this.num)
    this.isFirstCal = false
  }

  destroy() {
    if (!this.isFirstCal) throw new Error()
  }
}

const cal = new Calculator(50)
cal.add(10).substract(1000).add(1).substract(100).result()
try {
  cal.add(10)
} catch (e) {
  console.log('exception!')
}

// 闭包实例
function foo(...numbers) {
  return numbers.reduce((res, cur) => res * cur, 1)
}
const a = foo(1,2 ,3 ,4)
console.log(a)


const map = {}
function fooPro(...numbers) {
  return function() {
    numbers.sort()
    const flag = numbers.join('')
    if (map[flag]) return map[flag]
    const res = numbers.reduce((res, cur) => res * cur, 1)
    map[flag] = res
    return res
  }
}
const b = fooPro(1, 2, 3, 4, 5)()
const c = fooPro(5, 4, 3, 2, 1)()
console.log(b, c)