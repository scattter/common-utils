const myClone = (target) => {
  // handle date and regexp
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);
  if (typeof target === 'object' && target !== null) {
    const targetClone = Array.isArray(target) ? [] : {}
    for (let key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        targetClone[key] = (typeof target[key] === 'object') ? myClone(target[key]) : target[key]
      }
    }
    return targetClone
  } else {
    return target
  }
}
let arr1 = [ 1, 2, { val: 4, xdm: { dd: 99 } } , {'hasOwnProperty': 3}];
let str = myClone(arr1)
console.log(str)
