interface Database {
  get(id: string): string
  set(id: string, value: string): void
}

interface Persistable {
  saveToString(): string
  restoreFromString(storeState: string): void
}

class InMemoryDataBase implements Database {
  protected db: Record<string, string> = {}
  get(id: string): string {
    return this.db[id]
  }
  set(id: string, value: string): void {
    this.db[id] = value
  }
}

const myDb1 = new InMemoryDataBase()
myDb1.set('name', 'lucy')
// because protected attribute so can't set db
// myDb1.db['name'] = 'jack'
console.log(myDb1.get('name'))

class MyDB extends InMemoryDataBase implements Persistable{
  saveToString(): string {
    return JSON.stringify(this.db)
  }

  restoreFromString(storeState: string): void {
    this.db = JSON.parse(storeState)
  }
}

const myDb2 = new MyDB()
myDb2.set('name', 'lucy-2')
console.log(myDb2.saveToString())

myDb2.restoreFromString('{"name":"lucy-3"}')
console.log(myDb2.saveToString())