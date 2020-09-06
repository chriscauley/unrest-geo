import mod from '../src/mod'

test('mod', () => {
  expect(mod(1,5)).toEqual(1)
  expect(mod(5,5)).toEqual(0)
  expect(mod(-1, 5)).toEqual(4)
  expect(mod(-5, 5)).toEqual(0)
})