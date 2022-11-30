function printToFile(text: string, callback: () => void) {
  console.log(text)
  callback()
}
printToFile('print to file', () => {})


function arrayMutate(array: number[], mutate: (v: number) => number): number[] {
  return array.map(mutate)
}
const array1 = arrayMutate([1, 20, 3], v => v * 10)
console.log(array1)


type MutateFunction = (v: number) => number
function arrayMutate2(array: number[], mutate: MutateFunction): number[] {
  return array.map(mutate)
}

const myNewMutateFunction = (v: number) => v * 100

function addNumber(target: number): MutateFunction {
  return (value: number) => value + target
}
const addOne = addNumber(1)
console.log(addOne(50))