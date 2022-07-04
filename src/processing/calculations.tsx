type KeyValues = { [key: string]: number }

export const sumObjects = (objects: KeyValues[]): KeyValues => {
  if (!objects.length) return {}

  const keys: string[] = Object.keys(objects[0])
  const values: number[][] = objects.map(object => Object.values(object))
  let summedValues: number[] = values.reduce( (s1, s2) => s1.map( (num, idx) => num + s2[idx]))
  
  let summedObject: KeyValues = {}
  keys.forEach((key, idx) => summedObject[key] = summedValues[idx])

  return summedObject
}