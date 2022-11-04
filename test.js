// function add(a, b) {
//   return Promise.resolve(a + b);
// }
//
// function sum(arr = [1,2,3,4,5]){
// }
//
// function foo() {
//   return new Promise(() => {
//     console.log('1')
//   })
// }

// function maxLengthBetweenEqualCharacters( s ) {
//   // write code here
//   if(!s || s.length === 0) return -1
//   // if(s.length === 1) return 0
//   const map = {}
//   for(let i = 0; i < s.length; i++) {
//     if(!map[s[i]]) {
//       map[s[i]] = [i]
//     } else {
//       map[s[i]].push(i)
//     }
//   }
//   return Math.max.apply(Math, Object.values(map).map(value => {
//     if (!value || value.length === 1) return 0
//     return value[value.length - 1] - value[0]
//   }))
// }
// const a = maxLengthBetweenEqualCharacters()
// console.log(a)



// setTimeout(() => {
//   console.log('e')
// })
//
// Promise.resolve().then(() => {
//   console.log('a')
// }).then(() => {
//   return Promise.resolve('p1').then(data => {
//     setTimeout(() => {
//       console.log('x')
//     })
//     console.log('p2')
//     return data
//   })
// }).then(data => {
//   console.log(data)
// })

// 比较版本号 ：
// 输入为 1.2 1.2.4
// 输出为 -1
// 实现compareVersion函数

// const version1 = ''
// const version2 = ''
//
// const compareVersion = (v1, v2) => {
//   if (v1 === v2) return 0
//   return v1 < v2 ? -1 : 1
// }
//



// 实现通过宇符串前缀从数组中找出搜索建议列表。写出你知道的所有实现方式。
// 例如：
// const list = [
//   'good',
//   'a good idea',
//   'goods',
//   'google',
//   'googleMap',
//   'googleEarth',
//   'google+',
//   'googleMail'
// ]
//
// suggest('good', list)
// //output
//   [
//   'good',
//     'goods'
//   ]


// const transform = (input, output) => {
//   const fun = (lst, index, out) => {
//     if (lst.length === 0) {
//       out[lst.shift()] = {
//         index
//       }
//       return out
//     }
//     out[lst.shift()] = {}
//   }
//   input.forEach((str, index) => {
//     fun(str.split(''), index, output)
//   })
//   return output
// }
//
// const input = ['good', 'goods']
//
// const re = transform(input, {})
// console.log(re)

// g: {
//   o: {
//     o: {
//       d: {
//         index: 0,
//         s: {
//           index: 2
//         }
//       },
//       l: {}
//     }
//   }
// }


// 一个12小时的表盘上，找出时钟表盘上时针和分钟夹角为6度的时刻，注意分针每走一分钟，时针的位置都会发生微小的改变
// 表盘上分针只有整数，只需要考虑整数分钟的场景；用你熟悉的语言写出代码，运行，找出结果
// 例如：12点整，时针分钟夹角0度，12点零1分是5.5度

// 60
// 12  360 / 12 = 30
// m h
// deg1 = h * 30 + m / 60 * 30    deg2 = m / 60 * 360
// h: 0 - 12   m: 0 - 60
// const res = () => {
//   let result = []
//   let h = 0
//   while (h < 12) {
//     for (let m = 0; m < 60; m++ ) {
//       const hourDeg = h * 30 + m / 60 * 30
//       const minuteDeg = m / 60 * 360
//       if (Math.abs(hourDeg - minuteDeg) === 6) {
//         result.push([h, m])
//       }
//     }
//     h++
//     // h * 30  + 0.5m  - 6m = 6    30h - 5.5m = 6
//   }
//   console.log(result)
//   return result
// }

const url = 'http://m.meijiabang.cn/index.html?key0=0&key1=1&key2=2'

const reg = /([?&])([=])/g
console.log(url.match(reg))











