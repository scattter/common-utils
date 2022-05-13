export class Observe {
  constructor(name, subject) {
    this.name = name
    if (subject) {
      subject.addObserve(this)
    }
  }
  
  notified(message) {
    console.log(this.name, 'get a message:  ', message)
  }
}

export class Subject {
  constructor() {
    this.observerList = []
  }
  
  addObserver(observer) {
    this.observerList.push(observer)
  }
  
  removeObserver(observer) {
    const index = this.observerList.findIndex(o => o.name === observer.name)
    this.observerList.splice(index, 1)
    console.log(this.observerList)
  }
  
  notifyObservers(message) {
    const observers = this.observerList
    observers.forEach(observer => observer.notified(message))
  }
}
