type SimpleType = [x: number, y: string]
function logger(arg1: SimpleType, arg2: SimpleType) {
  return [
    arg1[0] + arg2[0],
    arg1[1] + arg2[1]
  ]
}
const res = logger([1, 'first '], [10, 'second'])
console.log(res)

function SimpleStringStore(initValue: string): [get: () => string, set: (v: string) => void ] {
  let str: string = initValue
  return [
    () => str,
    (v) => {
      str = v
    }
  ]
}

const [getter1, setter1] = SimpleStringStore('good')
const [getter2, setter2] = SimpleStringStore('new')
console.log(getter1())
console.log(getter2())
setter1('bye')
setter2('day')
console.log(getter1())
console.log(getter2())