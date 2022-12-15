enum MyEnum {
  beforeLoading,
  loading,
  afterLoading
}

console.log(MyEnum.beforeLoading, MyEnum['beforeLoading'])

const isLoading = (str: MyEnum) => {
  return str === MyEnum.loading
}

console.log('is loading?', isLoading(MyEnum.beforeLoading))

const englishLoading = {
  [MyEnum.loading]: 'loading'
}
console.log(englishLoading)

// literal type
const literalFun = (num: 1 | 2) => {
  return num * 10
}
literalFun(1)

function myLiteralFun (str: 'name', out: 'name length'): string;
function myLiteralFun (str: 'age', out: 'age length'): string;
function myLiteralFun (str: string, out: unknown): string {
  return str + out
}

