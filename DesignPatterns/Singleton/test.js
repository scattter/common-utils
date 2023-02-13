const Counter = require('./code')

const ins1 = new Counter()
// const ins2 = new Counter()

console.log(ins1, ins1.getCount())

ins1.increment()
ins1.increment()
console.log(ins1.getCount())


ins1.decrement()
console.log(ins1.getCount())
