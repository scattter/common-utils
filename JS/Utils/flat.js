let res = []
const target = [1, [1, 2], [1, [2]]]
const myFlat = (arrs) => {
  if (!Array.isArray(arrs)) {
    res.push(arrs)
  } else {
    arrs.forEach(arr => {
      myFlat(arr)
    })
  }
}
myFlat(target)
console.log(res, '---')
