// adapted from lodash

const step = 1

export default function baseRange(start, end) {
  if (end === undefined) {
    end = start
    start = 0
  }
  let index = -1
  let length = Math.max(Math.ceil((end - start) / step), 0)
  const result = new Array(length)

  while (length--) {
    result[++index] = start
    start += step
  }
  return result
}
