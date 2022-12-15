interface MyCat {
  name: string
  age: number
}

const makeCat = (name: string, age: number): MyCat => {
  return {
    name,
    age
  }
}
const myCat = makeCat('wws', 4)
myCat.age = 10

const makeReadonlyCat = (name: string, age: number): Readonly<MyCat> => {
  return {
    name,
    age
  }
}
const myReadonlyCat = makeReadonlyCat('wws', 4)
// myReadonlyCat.age = 10

type MyReadonlyCat = Readonly<MyCat>

const falseConst = [0, 1, 2]
falseConst[0] = 1

const reallyConst = [0, 1, 2] as const
// reallyConst[0] = 3