
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './vuex/store.js'

// router.beforeEach((to, from, next) => {
//   if (store.state.isLogin) {
//     // 登录状态下进入登录页，重定向到首页
//     if (to.meta && to.meta.requireAuth === false) {
//       document.title = '1Token官网'
//       next({ path: '/' })
//     }
//   } else {
//     if (to.meta && to.meta.requireAuth === true) {
//       document.title = '登录1Token'
//       next({ path: `/login?redirect=${to.path}` })
//     }
//   }
//   document.title = to.meta ? to.meta.title : '1Token'
//   next()
// })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
