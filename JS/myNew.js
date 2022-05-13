function MyNew(ctro) {
  if(typeof ctro !== 'function'){
    throw 'newOperator function the first param must be a function';
  }
  console.log(ctro.prototype, ctro.prototype.__proto__, '***');
  // Object.create() 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
  const obj = Object.create(ctro.prototype)
  // 下面的方法不建议使用
  // Object.setPrototypeOf(obj, ctro.prototype)
  ctro.call(obj, [...arguments].slice(1))
  return obj
}

function Person(name) {
  this.name = name
  
  this.getName = function () {
    return 'getName'
  }
}
Person.prototype.age = 20
Person.prototype.getAge = function (){
  return 'getAge'
}
const a = new MyNew(Person, 'zz');
console.log(a)
console.log(a.getName())
console.log(a.getAge())
console.log(a.__proto__)
console.log(typeof a)

// const b = new MyNew()
// console.log(b)


class MyNewWithCtro {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}
// const c = new MyNewWithCtro('zz')
// console.log(c)
// console.log(c.__proto__)

// 正则表达式判断长度是否在5和10之间
const reg = /^.{5,10}$/

