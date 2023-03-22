function curry(fn, ...existingArgs) {
  // show me your code
  if (existingArgs.length < fn.length) {
    return (...args) => {
      return curry(fn, ...existingArgs, ...args)
    }
  } else {
    return fn(...existingArgs)
  }
}

const addNum = (a, b, c, d) => {
  return a + b + c + d
}
const add = curry(addNum)


console.log(add(1)(5)(5)(5))