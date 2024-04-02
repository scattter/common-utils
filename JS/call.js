Function.prototype.callPolyfill = function (context, ...args) {
  context ||= window;
  const fn = this;
  console.log(this, 'this')

  const proxy = new Proxy(context, {
    get(target, propKey) {
      console.log(propKey, '===', fn, this)
      if (propKey === 'fn') {
        return fn;
      }

      return Reflect.get(...arguments);
    }
  })

  return proxy['fn'](...args);
}

const demo = function (price, count) {
  console.log(this.item, '---', price, '---', count)
}

function tax(price, taxRate) { console.log(`The cost of the ${this.item} is ${price * taxRate}`) }

// tax({ item: 'apple' }, 1, 2)
// tax.callPolyfill({ item: 'apple' }, 1, 2)

// demo({ item: 'apple' }, 1, 2)
demo.callPolyfill({ item: 'apple' }, 1, 2)

