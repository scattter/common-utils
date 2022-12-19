function CreateMemoryDataBase<T>() {
  return class CreateMemoryDataBase<T> {
    private db: Record<string, T> = {}

    set(id: string, value: T) {
      this.db[id] = value
    }

    get(id: string): T {
      return this.db[id]
    }

    getObject(): object {
      return this.db
    }
  }
}

const StringMemoryDatabase = CreateMemoryDataBase<string>()
const stb1 = new StringMemoryDatabase()
stb1.set('a', 'hello a')
console.log(stb1.getObject())


// use mixin to complete getObject fun
type Construct<T> = new (...args: any[]) => T

function DumpInfo<T extends Construct<{
  getObject(): object
}>>(Base: T) {
  return class DumpInfo extends Base {
    dump() {
      console.log(this.getObject())
    }
  }
}
const DumpInfoDatabase = DumpInfo(StringMemoryDatabase)
const stb2 = new DumpInfoDatabase()
stb2.set('b', 'hello b')
stb2.dump()
