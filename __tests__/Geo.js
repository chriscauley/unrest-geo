import Geo from '../src/Geo'
import Shapes from '../src/Shapes'

const snapIndexes = (geo, indexes, title) => {
  if (process.env.VERBOSE) {
    const board = {}
    board[geo.CENTER] = 'X'
    indexes.forEach((index, i) => (board[index] = numalpha[i] || '?'))
    console.log(geo.print(board, { empty: '.', title })) // eslint-disable-line
  }
  expect(indexes.join(',')).toMatchSnapshot()
}

test('xy2index', () => {
  const geo = Geo(5, 5)
  const b = { geo }
  const set = (xy, v) => (b[geo.xy2index(xy)] = v)
  set([2, 2], 1)
  set([-1, 0], 2)
  set([3, -2], 3)
  set([1, 8], 4)
  set([5, 3], 5)
  set([6, 0], 6)
  snapIndexes(geo, Object.keys(b), 'xy2index board')
})

const numalpha = '0123456789abcdefghijklmnopqrstuvqxyz'

Shapes.list
  .filter((s) => !s.startsWith('__'))
  .forEach((shape) => {
    test.only('look.' + shape, () => {
      const dist = 3
      const geo = Geo(dist * 2 + 1)
      const dindex = 1
      const indexes = geo.look(shape, geo.CENTER, dist, dindex)
      const title = `${shape} ${dist} ${geo._dindex2name[dindex]}`
      snapIndexes(geo, indexes, title)
    })
  })

test('`geo.look(shape, index, dist, dindex)` changes direction with dindex', () => {
  const shape = 'cone'
  const dist = 4
  const geo = Geo(dist * 2 + 1)
  const index = geo.CENTER
  geo.dindexes.forEach((dindex) => {
    const indexes = geo.look(shape, index, dist, dindex)
    const dir = geo._dindex2name[dindex]
    snapIndexes(geo, indexes, `"${shape}" facing ${dir} at dist ${dist}`)
  })
})
