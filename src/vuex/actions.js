
export default {
  // 应用初始化数据：contract、currency 和 tradeAccount
  async example({ state, commit, dispatch }) {
    let storage = localStorage.getItem(state.tradeSettingStroageName)
    // local storage 没有的话，就从 defaultSettings 里拿
    if (storage === null) {
      localStorage.setItem(
        state.tradeSettingStroageName,
        JSON.stringify(defaultSetting)
      )
      storage = defaultSetting
    } else {
      storage = JSON.parse(storage)
    }
    // TODO:Will Be deleted
    if (!storage.contract) {
      storage = defaultSetting
    }

    commit('updateProp', { key: 'pageSetting', value: storage })
    // 更新exchangeMaps first
    await dispatch('getExchangeMaps')
    dispatch('getExchangeRateList')
    const {
      ticker,
      exchange,
      contract,
      tradeAccount,
      currency
    } = storage
    commit('updateProp', { key: 'tradeAccount', value: tradeAccount })
    commit('updateProp', { key: 'ticker', value: ticker })
    commit('updateProp', { key: 'exchange', value: exchange })
    const tickerSetting = await dispatch('updateContractSetting', {
      exchange,
      ticker
    })
    if (tickerSetting === undefined) {
      dispatch('updateContract', contract)
    } else {
      const updateStates = {
        tickerSetting: tickerSetting,
        currency: currency
      }
      // 切换交易所，需要清空资产、帐号信息
      commit('updateProps', updateStates)
    }
  }
}
