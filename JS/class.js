// ES5之前是没有class继承的 只能使用其他方法间接实现, 由于自己精力有限, 记忆容易错乱, 所以就只有一些主流的继承实现

// ES6 class里面的constructor方法是不可枚举的
// 1. 使用构造函数实现
// 该实现方式只能继承实例属性, 不能继承原型链上的
// 缺点: 无法实现复用，每个子类都有父类实例函数的副本，影响性能
function Parent1(name, age) {
  this.name = name
  this.age = age
  this.info = 'parent info'
}
Parent1.prototype.size = 2

function Child1(name, age, height) {
  Parent1.call(this, name, age)
  this.height = height
}


// 2. 使用原型链实现继承
// 这种方式会继承原型链上的属性, 但是不会继承实例上的
// 构造函数、原型和实例之间的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个原型对象的指针。
// 缺点: 继承的本质就是复制，即重写原型对象，代之以一个新类型的实例
// 即如果原型上的是引用类型, 那么其他子类继承后对原型属性进行修改会影响到其他子类和父类的原型属性
function Parent2() {
  this.name = 'parent2'
}
Parent2.prototype.size = 2
Parent2.prototype.ages = [18]

function Child2() {
  this.height = 100
}
// 这里如果直接使用Parent2.prototype 那么子类和父类的prototype指向一个地址
// 如果子类prototype新增属性  父类也会存在
// 使用new操作符创建一个新的对象 该对象将会被[[Prototype]]链接到这个函数的prototype对象上
Child2.prototype = new Parent2()
Child2.prototype.constructor = Child2


// 3. 组合式继承
// 通过这种方式可以继承父级原型链上的属性, 在继承父级实例上属性的基础上, 有自己的属性
// 原型的继承那里有两种写法, 不同写法有不同的结果
// 缺点: 该方式调用了两次父类的构造函数
function Parent3(name) {
  this.name = name
  this.size = [1]
}
Parent3.prototype.ages = [1, 2, 3]

function Child3(name) {
  Parent3.call(this, name)
}
Child3.prototype.__proto__ = Parent3.prototype // 这个是没有中间商, 所以不会有双份属性
// Child3.prototype = new Parent3() // 这个相比于上一行是多了一个中间商Parent3的实例去链接原型
Child3.prototype.constructor = Child3


// 4. 寄生组合式继承
// 这里许多和组合式继承类似, 解决的是组合式继承的两次调用父级问题
// 这是最成熟的方法, 但是这里的实现
// Object.create(parent.prototype)和上面Child3.prototype.__proto__ = Parent3.prototype有什么区别?
function inherit(child, parent) {
  let prototype = Object.create(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}
function Parent4(name) {
  this.name = name
  this.size = [1]
}
Parent4.prototype.ages = [1, 2, 3]
function Child4() {}
inherit(Child4, Parent4)


// 5. ES6的继承
class Parent5 {
  constructor(name) {
    this.name = name
  }
  ages() {
    return [1, 2, 3]
  }
}
class Child5 extends Parent5 {
  constructor(name) {
    super(name);
  }
  log() {
    console.log(super.ages(), '---')
  }
}