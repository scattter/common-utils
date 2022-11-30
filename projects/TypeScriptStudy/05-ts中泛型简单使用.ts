function SimpleStringStore<T>(initValue: T): [get: () => T, set: (v: T) => void ] {
  let str: T = initValue
  return [
    () => str,
    (v) => {
      str = v
    }
  ]
}

const [get1, set1] = SimpleStringStore<number>(10)
console.log(get1())
set1(100)
console.log(get1())

const [get2, set2] = SimpleStringStore<string | null>(null)
console.log(get2())
set2('this is not null')
console.log(get2())


function rankItem<T>(target: T[], rank: (v: T) => number): T[] {
  const temp = target.map(item => {
    return {
      item,
      rank: rank(item)
    }
  })

  temp.sort((a,b) => a.rank - b.rank)
  return temp.map(rankedItem => rankedItem.item)
}

interface Cat {
  name: string
  hp: number
}

const cats = [
  {
    name: 'lucy',
    hp: 80
  },
  {
    name: 'jack',
    hp: 10
  }
]

console.log('init cats', cats)
const rankedCats = rankItem<Cat>(cats, ({hp}) => hp)
console.log('ranked cats', rankedCats)