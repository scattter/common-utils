class Dog {
  constructor(name) {
    this.name = name
  }

  bark() {
    console.log('Woof')
  }
}

const dog = new Dog('root dog')

// Error
// dog.play()

dog.__proto__.play = () => {
  console.log('begin play')
}
dog.play() // 'begin play'

// instance's proto equal Class' prototype
// any type has proto, but only function has prototype
dog.__proto__ === Dog.prototype


class SuperDog extends Dog {
  constructor(name) {
    super(name);
  }

  fly() {
    return "Flying!";
  }
}

const dog1 = new SuperDog("Daisy");
dog1.fly() // Flying!


const pet1 = Object.create(dog);
pet1.bark() // Woof
pet1.play() // begin play

