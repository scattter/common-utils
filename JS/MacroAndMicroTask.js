// https://zh.javascript.info/event-loop

// case 1
console.log('------- case 1 ---------')
console.log(1);

setTimeout(() => console.log(2));

Promise.resolve().then(() => console.log(3));

Promise.resolve().then(() => setTimeout(() => console.log(4)));

Promise.resolve().then(() => console.log(5));

setTimeout(() => console.log(6));

console.log(7);


// case 2
// console.log('------- case 2 ---------')
// setTimeout(() => {
//   console.log('-----2-----')
// }, 5000)
//
// setInterval(() => {
//   setTimeout(() => {
//     console.log('setInterval')
//   })
// }, 500)

// case 3 (async)
// console.log('------- case 3 ---------')
// const slow = async () => {
//   for (let i = 0; i < 10000 * 10000; i++) {
//   }
//   console.log('this is async fun')
//   return 1
// }
// const fun1 = async () => {
//   console.log('async before')
//   await slow()
//   console.log('async after')
// }
//
// const fun2 = async () => {
//   await fun1()
//   console.log('out fun')
// }
// fun2()

// case 4 (setTimeout)
// console.log('------- case 3 ---------')
// setTimeout(() => {
//   console.log('time is 1000')
// }, 1000)
//
// setTimeout(() => {
//   console.log('time is 500')
// }, 500)
//
// Promise.resolve(
//   console.log('this is promise')
// ).then(() => {
//   setTimeout(() => {
//     console.log('time is 1500')
//   }, 1500)
// })
