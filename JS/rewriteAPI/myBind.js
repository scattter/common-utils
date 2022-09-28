// bind 有如下特性：
//
// 1、指定 this
// 2、传入参数
// 3、返回一个函数
// 4、柯里化

// 特殊的有
// 一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器，
// 提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
// 生成的新对象会绑定到函数调用的this。

// apply的实现
Function.prototype.myApply = function (ctx, ...args) {
  ctx = typeof ctx === 'object' ? ctx : window
  // 使用symbol的原因是其生成的key是唯一的, 极大降低了属性重名的风险
  const key = Symbol('dsf')
  ctx[key] = this
  // 不能直接使用that去保存this然后调用, 因为只保存了函数, 没有调用者this
  // const that = this
  // console.log(that, ctx)
  // const result = that(...args)
  // ctx相当于this, 调用者
  // ctx[key]是要调用的函数, 只有这样才能正确改变this的指向
  const result = ctx[key](...args)
  delete ctx[key]
  return result
}

// 测试代码
foo = {
  val: 1
}

bar = {
  val: 2,
  test: function () {
    console.log(this.val)
  }
}
bar.test.myApply(foo)


Function.prototype.myBind = function (ctx) {
  if (typeof ctx !== 'function') {
    throw new Error('must function')
  }

  // bind时
  const fn = function () {}
  const self = this
  // 获取传递的参数 (bind的时候传递的)
  const args = Array.prototype.slice.call(arguments, 1)

  // 调用时
  const fBound = function () {
    // 获取调用的时候传递的参数, 同时将参数进行数组化
    const bindArgs = Array.prototype.slice.call(arguments)
    // 这里的this是调用时候的this 如果调用的时候this 属于fn函数, 即生成时候的函数
    // new 生成的新对象会绑定到函数调用的this。 this是fn的实例，说明是new出来的
    return self.apply(this instanceof fn ? this : ctx, args.concat(bindArgs))
  }

  // 空对象的原型指向绑定函数的原型
  fn.prototype = this.prototype
  // 空对象的实例赋值给 fBound.prototype
  fBound.prototype = new fn()

  return fBound
}

