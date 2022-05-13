import {Subject, Observe} from './assert.js'

const subject = new Subject()

const observerA = new Observe('observerA', subject)
const observerB = new Observe('observerB')

subject.addObserver(observerB)

subject.notifyObservers('hello, A and B')

subject.removeObserver(observerB)
subject.notifyObservers('hello A')
