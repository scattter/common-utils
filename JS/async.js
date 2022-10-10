async function add(a, b) {
  return Promise.resolve(a + b);
}

async function sum(arr = [1,2,3,4,5]){
  let result = 0
  for (const item of arr) {
    result = await add(result, item)
  }
  return result
}

try {
  sum([1,2,3,4,5])
    .then(result => {
      console.log(result)
    })
} catch (e) {
  console.log(e)
}