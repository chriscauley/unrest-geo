export default (bool, e) => {
  if (!bool) {
    if (typeof e === 'function') {
      e = e()
    }
    if (typeof e === 'string') {
      e = Error(e)
    }
    throw e
  }
}