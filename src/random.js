import xorshift from 'xorshift'

const rand = (seed) => {
  const r = xorshift.constructor([seed, seed, seed, seed])
  r.randomint() // first number isn't very random for low s
  return r.randomint()[1]
}
rand.choice = (seed, array) => array[rand(seed) % array.length]
rand.int = (seed, min, max) => {
  if (max === undefined) {
    max = min
    min = 0
  }
  const range = max - min
  return min + (rand(seed) % range)
}

export default rand
