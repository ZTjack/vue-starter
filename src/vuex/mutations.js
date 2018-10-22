

export default {
  // 设置页面 WebSocket 的链接状态
  example(state, data) {
    state.health[data.key].connected = data.value
  }
}
