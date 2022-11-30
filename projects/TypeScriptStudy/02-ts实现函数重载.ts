interface Coordinate {
  x: number
  y: number
}

function parseCoordinate(str: string): Coordinate;
function parseCoordinate(coordinate: Coordinate): Coordinate;
function parseCoordinate(x: number, y: number): Coordinate;

function parseCoordinate(arg1: unknown, arg2?: unknown): Coordinate {
  let coordinate = {
    x: 0,
    y: 0
  }
  if (typeof arg1 === 'string') {
    const attrs = arg1.split(',')
    attrs.forEach(attr => {
      const [key, value] = attr.split(':')
      coordinate[key.trim() as keyof Coordinate] = parseInt(value)
    })
  } else if (typeof arg1 === 'object') {
    coordinate = { ...(arg1 as Coordinate) }
  } else {
    coordinate = {
      x: arg1 as number,
      y: arg2 as number
    }
  }
  return  coordinate
}

console.log(parseCoordinate('x: 1, y: 2'))
console.log(parseCoordinate({
  x: 3,
  y: 4
}))
console.log(parseCoordinate(5, 6))