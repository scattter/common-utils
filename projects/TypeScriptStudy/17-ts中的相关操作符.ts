// ---------- *** ----------
// ?.
interface Interface1 {
  name: string
  age?: number
}

const obj1: Interface1 = {
  name: 'obj 1'
}
console.log(obj1?.age)

// !
function test (params: number | undefined | null, callback: ()=>number | undefined )
{
  const count = params! // 排除undefined 和null，不报错

  const number = callback!() // 除去undefined
}


// ---------- *** ----------
// &
type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };

const point: Point = {
  x: 1,
  y: 1
}

interface X {
  c: string;
  d: string;
}

interface Y {
  c: string;
  e: string
}

type Z1 = X & Y
let z1: Z1 = {
  d: '000',
  e: '000',
  c: '000',
}
// {
//   c : never;
//   d :string;
//   e : string
// }


// ---------- *** ----------
// |
interface Interface2 {
  c: string;
  d: string;
}
interface Interface3 {
  c: string;
  e: string;
}
type Z2 = Interface2 | Interface3
let z2: Z2 = {
  e: '000',
  d: '000',
  c: '000',
}


// ---------- *** ----------
// _
const inhabitantsOfMunich = 1_464_301; // 1464301

// typeof
interface Person {
  name: string;
  age: number;
}

const sem: Person = { name: "ming", age: 30 };
type Sem = typeof sem; // type Sem = Person


// ---------- *** ----------
// const
let x = "hello" as const;
type X3 = typeof x; // type X = "hello"

let y = [10, 20] as const;
type Y3 = typeof y; // type Y = readonly [10, 20]

let z = { text: "hello" } as const;
type Z = typeof z; // let z: { readonly text: "hello"; }

// A 'const' assertions can only be applied to references to enum members,
// or string, number, boolean, array, or object literals.
// let a = (Math.random() < 0.5 ? 0 : 1) as const; // error

let b = Math.random() < 0.5 ? 0 as const :
  1 as const;


// ---------- *** ----------
// keyof and typeof
const COLORS = {
  red: 'red',
  blue: 'blue'
}

// 首先通过typeof操作符获取Colors变量的类型，然后通过keyof操作符获取该类型的所有键，
// 即字符串字面量联合类型 'red' | 'blue'
type Colors = keyof typeof COLORS
let color: Colors;
color = 'red' // Ok
color = 'blue' // Ok

// Type '"yellow"' is not assignable to type '"red" | "blue"'.
// color = 'yellow' // Error

// ---------- *** ----------
// in
type Keys = 'a' | 'b' | 'c';
type Obj = {
  [ T in Keys]: string;
}
// in 遍历 Keys，并为每个值赋予 string 类型

// type Obj = {
//     a: string,
//     b: string,
//     c: string
// }