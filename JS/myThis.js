// 参考文章
// http://fangwenzheng.top/article/%2Fdocs%2FWEB%2F%E5%85%B3%E4%BA%8Ethis.md
// https://zh.javascript.info/object-methods
// this的指向从优先级可以描述为:
// 箭头函数 , new 绑定 => call/apply/bind显示绑定 => 隐式绑定(谁调用指向谁) => 默认绑定(严格和非严格, setTimeout)

// 默认绑定
console.log('*****默认绑定*****')
const name = 'default'

function defaultThis() {
  console.log('default', ' --- ', this.count)
}
defaultThis()


// 隐式绑定
// 对于默认绑定来说，决定this绑定对象的并不是调用位置是否处于严格模式，而是函数体是否处于严格模式。如果函数体处于严格模式，this会被绑定到undefined，否则this会被绑定到全局对象。
console.log('*****隐式绑定*****')
const obj = {
  name: 'obj',
  getName(){
    console.log('obj', ' --- ', this.name)
    return this.name
  }
}
obj.getName()


// 显示绑定
console.log('*****显示绑定*****')
const obj2 = {
  name: 'obj2'
}
obj.getName.call(obj2) // 接受参数列表
obj.getName.apply(obj2) // 接受参数数组
const bindObj = obj.getName.bind(obj2) // 生成新的函数, 属于硬绑定, 返回的 boundFunction 的 this 指向无法再次修改
bindObj()


// new 绑定
console.log('*****new 绑定*****')
function ClassA(name) {
  this.name = name
  this.age = 12
  this.getName = function () {
    console.log('new', ' --- ', this.name)
  }
  // 如果不写这个方法, 那么外部call绑定this报错: call is not a function
  this.call = function() {
    console.log('this is call fun')
  }
}
const new1 = new ClassA('new')
new1.getName()
// 下面这个this的改变是对new1以及生成的对象的this指向更改
new1.getName.call(obj)
// new ClassA('new').call(obj) 才是对new关键字this绑定的更改, 这样会带来错误
// const new2 = new ClassA('new').call(obj)
// 生成一个undefined
// console.log(new2)
// new2.getName()

const ClassB = {
  name: '时间跳跃',
  fn: function () {
    this.name = '听风是风'
  }
};
let echo = new ClassB.fn()
console.log(echo.name) //听风是风


// 箭头函数
// 箭头函数中没有this，箭头函数的this指向取决于外层作用域中的this，外层作用域或函数的this指向谁，箭头函数中的this便指向谁
let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],
  
  showList() {
    this.students.forEach(
      student => console.log(this.title + ': ' + student)
    );
  }
};

group.showList();

// 更安全的this
// 有时会把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用时会被 忽略，实际应用的是默认绑定规则
// Object.create(null)和{}很像，但是并不会创建Object.prototype这个委托，所以它 比{}“更空”
function foo(a, b) {
  console.log( "a:" + a + ", b:" + b );
}

// 我们的DMZ空对象
const ø = Object.create( null );

// 把数组展开成参数
foo.apply( ø, [2, 3] ); // a:2, b:3

// 使用bind(..)进行柯里化
const bar = foo.bind( ø, 2 );
bar( 3 ); // a:2, b:3

// 箭头函数的绑定无法被修改
function foo2() {
  // 返回一个箭头函数
  return (a) => { //this继承自foo()
    console.log( this.a );
  };
}
const res1 = { a:2 };
const res2 = { a:3 };
// foo()内部创建的箭头函数会捕获调用时foo()的this。由于foo()的this绑定到obj1，bar（引用箭头 函数）的this 也会绑定到obj1
const bar2 = foo2.call( res1 );
bar2.call( res2 ); // 2, 不是3！


// 练习题
// 1
function makeUser1() {
  return {
    name: "John",
    ref: this
  };
}

let user1 = makeUser1();

alert( user1.ref.name ); // 结果是什么？

function makeUser2() {
  return {
    name: "John",
    ref() {
      return this;
    }
  };
}

let user2 = makeUser2();

alert( user2.ref().name ); // John

// 2
let ladder = {
  step: 0,
  up() {
    this.step++;
    return this;
  },
  down() {
    this.step--;
    return this;
  },
  showStep() {
    alert( this.step );
    return this;
  }
};

ladder.up().up().down().showStep().down().showStep(); // 展示 1，然后 0
