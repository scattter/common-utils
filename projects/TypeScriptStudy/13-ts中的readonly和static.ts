class DogInfo12 {
  constructor(public readonly name: string, public readonly age: number) {
  }
}

const myDog1 = new DogInfo12('jack', 18)
console.log(myDog1.name)
// myDog1.name = '009'

// need to learn static, public, private in class
class DogInfoList {
  private constructor() {
  }

  private doggs: DogInfo12[] = []

  static instance: DogInfoList = new DogInfoList()

  static addDog(dog: DogInfo12) {
    DogInfoList.instance.doggs.push(dog)
  }

  getDogList() {
    return this.doggs
  }
}

DogInfoList.addDog(myDog1)

console.log(DogInfoList.instance.getDogList())
