const M = 0x80000000 - 1 // 2**31 - 1;
const A = 1103515245
const rand = (seed) => ((A + seed) * (A + seed) * A) % M
rand.choice = (s, array) => array[rand(s) % array.length]
rand.int = (seed, min, max) => {
  if (max === undefined) {
    max = min
    min = 0
  }
  const range = max - min
  return min + (rand(seed) % range)
}

export default rand