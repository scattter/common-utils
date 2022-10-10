const { Event } = require('./code')

const event = new Event()

event.on('click', (context) => {
  console.log(context)
})


event.emit('click', 'first click')

event.on('click', (context) => {
  console.log(context.toUpperCase())
})

event.emit('click', 'second click')

event.on('double-click', (context) => {
  console.log(context.toUpperCase())
})

event.off('click')

event.emit('click', 'third click')
event.emit('double-click', 'double click')
