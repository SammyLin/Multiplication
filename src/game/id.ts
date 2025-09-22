let idCounter = 0

export const createId = (prefix = 'mul') => {
  idCounter += 1
  const randomSlice = Math.floor(Math.random() * 1000)
  return `${prefix}-${Date.now()}-${idCounter}-${randomSlice}`
}
