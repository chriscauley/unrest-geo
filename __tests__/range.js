import range from '../src/range'

test('0', () => {
  expect(range(0)).toEqual([])
  expect(range(1, 1)).toEqual([])
})

test('5', () => {
  expect(range(5)).toEqual([0,1,2,3,4])
  expect(range(1, 5)).toEqual([1,2,3,4])
})