const foo = {
  name: 'foo',
  get value() {
    return this.name
  }
}

const proxy = new Proxy(foo, {
  get(target, p, receiver) {
    console.log(`proxy value is ----- ${target[p]}, ${Reflect.get(target, p)}`)
    return target[p]
  }
})

const bar = {
  name: 'bar'
}

// Reflect.get(target, p) and target[p] only can get foo property
proxy.value
Object.setPrototypeOf(bar, proxy)
bar.value


// Reflect.get(target, p, receiver) can get bar property
console.log('------ split ------')
const proxy2 = new Proxy(foo, {
  get(target, p, receiver) {
    console.log(receiver === foo, receiver === bar, receiver === proxy)
    console.log(`proxy2 value is ----- ${Reflect.get(target, p, receiver)}`)
    return Reflect.get(target, p, receiver)
  }
})

Object.setPrototypeOf(bar, proxy2)
bar.value