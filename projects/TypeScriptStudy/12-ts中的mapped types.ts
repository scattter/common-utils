// easy case 1
type FlexibleDog = {
  name: string
  [key: string]: string | number
}

const myFlexibleDog: FlexibleDog = {
  name: 'jack',
  age: 12,
  email: 'no-no-no'
}
console.log(myFlexibleDog)

// difficult case 2
interface DogInfo {
  name: string,
  age: number
}

type OptionsFlags<Type> = {
  [Property in keyof Type as `on${Capitalize<string & Property>}Change`]: (newValue: Type[Property]) => void
}

type Listeners = OptionsFlags<DogInfo>

function listenToObject<T>(obj: T, listens: Listeners): void {
  console.log('----', obj)
}
const dog2: DogInfo = {
  name: 'lucy',
  age: 18
}

listenToObject(dog2, {
  onNameChange: (v: string) => {
    console.log('update to', v)
  },
  onAgeChange: (v: number) => {
    console.log('update to', v)
  }
})