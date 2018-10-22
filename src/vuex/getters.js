
export default {
  // 交易标的(大写形式)，即 Ticker "btc.usdt" 中的 BTC
  example(state, getters) {
    if (state.contract) {
      return state.exchangeMaps[state.exchange].type === 'spot' ? state.ticker.split('.')[0].toUpperCase() : '张'
    } else {
      return undefined
    }
  }
}
