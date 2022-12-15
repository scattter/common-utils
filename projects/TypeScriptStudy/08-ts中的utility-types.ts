interface MyUser {
  name: string
  id: number
  email?: string
}

type PartialMyUser = Partial<MyUser>

type RequiredMyUser = Required<MyUser>

type PickMyUser = Pick<MyUser, 'id' | 'email'>

type MyUserWithoutId = Omit<MyUser, 'id'>

const mapById = (items: MyUser[]): Record<MyUser['id'], MyUserWithoutId> => {
  return items.reduce((total, cur) => {
    const { id, ...others } = cur
    return {
      ...total,
      [id]:  others
    }
  }, {})
}

const users = [
  {
    id: 10,
    name: '123',
    email: 'xxx'
  },
  {
    id: 20,
    name: 'sss'
  }
]

console.log(mapById(users))