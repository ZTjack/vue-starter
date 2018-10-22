let avgPrice = null
let interval = null
let dataCb = null
let ts = null
let intervalId = null
let volume = null
let duration = null
let contract = null
//
function initCandle(candle, con, dur, intervl, cb) {
  volume = 1000
  ts = candle.x + new Date().getTimezoneOffset() * 60 * 1000
  duration = dur
  contract = con
  avgPrice = (candle.low + candle.high) / 2
  interval = intervl
  dataCb = cb
  startInterval()
}
function startInterval() {
  if (intervalId) {
    clearInterval(intervalId)
  }
  intervalId = setInterval(() => {
    const candle = genCandle()
    dataCb && dataCb(candle)
  }, interval)
}
function genCandle() {
  const base = avgPrice * 0.95
  const prices = []
  let i = 4
  while (i--) {
    prices.push(base * (1 + 0.1 * Math.random()))
  }
  const candle = {}
  candle.open = prices[0]
  candle.close = prices[3]
  candle.low = Math.min(...prices)
  candle.high = Math.max(...prices)
  candle.contract = contract
  candle.duration = duration
  candle.volume = volume * 0.95 * (1 + 0.1 * Math.random())
  candle.time = ts
  candle.amount = 0
  return candle
}
export { initCandle }
