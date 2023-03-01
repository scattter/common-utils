interface DataResult {
  length: number
  result: {
    name: string
    age: number
  }[]
}

function getData(count: number): Promise<DataResult> {
  return Promise.resolve({
    length: count,
    result: [
      {
        name: 't1',
        age: 1,
      },
      {
        name: 't2',
        age: 2,
      }
    ]
  })
}

type FinalResult<T> = T extends undefined ? Promise<DataResult> : void

function handleData<T extends undefined | ((data: DataResult) => void) >(count: number, cb?: T): FinalResult<T> {
  if (cb) {
    getData(count).then(cb)
    return undefined as FinalResult<T>
  } else {
    return getData(count).then(res => res) as FinalResult<T>
  }
}

(async function () {
  const res = await handleData(2)
  console.log(res, 'fully log')
})()
handleData(2, (data: DataResult) => {
  data.result.forEach(item => {
    console.log(item)
  })
})

console.log('no conditional type solution')
// not use conditional type
function handleDataRedo(count: number): Promise<DataResult>
function handleDataRedo(count: number, cb: (data: DataResult) => void): void
function handleDataRedo(count: number, cb?: (data: DataResult) => void): unknown {
  if (cb) {
    getData(count).then(cb)
    return undefined
  } else {
    return getData(count).then(res => res)
  }
}