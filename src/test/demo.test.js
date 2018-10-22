
// most function-to-be-used can be found here~
// https://jestjs.io/docs/en/using-matchers
// Period-Func can be found here~
// https://jestjs.io/docs/en/setup-teardown

import sum from './demo'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

