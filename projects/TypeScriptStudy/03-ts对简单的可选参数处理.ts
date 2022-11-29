function logger(arg1: string, arg2: string, arg3?: string) {
  console.log(`this is ${arg1} ${arg2} ${arg3 ?? ''}`)
}

logger('123', '456')
logger('123', '456', '789')

interface User {
  name: string
  info?: {
    email?: string
  }
}

function getEmail(user: User): string {
  if (user.info) {
    return user.info.email!
  }
  return 'no email'
}

function getEasyEmail(user: User): string {
  return user.info?.email ?? 'no email'
}

const user: User = {
  name: 'ts',
  info: {}
}

console.log(getEmail(user))
console.log(getEasyEmail(user))

function addCallback(x: number, y: number, callback?: () => void): void {
  console.log([x, y])
  callback?.()
}