/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'

// 不需要出现 Message 的路由名称
const avoidMessageRouterName = ['Trade', 'Trend', 'WapRegister', 'WapLogin']
const avoidMessageErrorCode = ['not_set', 'error']
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  window.location.href = `/login?redirect=${router.currentRoute.fullPath}`
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */

const errorHandle = (status, message, code) => {
  // 状态码判断
  switch (status) {
    case 400:
      (avoidMessageErrorCode.includes(code) || avoidMessageRouterName.includes(router.currentRoute.name))
        ? ''
        : Message({ message, type: 'error', duration: 1500 })
      break
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break
      // 403 token过期
      // 清除token并跳转登录页
    case 403:
      toLogin()
      break
      // tip('登录过期，请重新登录')
      // localStorage.removeItem('token')
      // store.commit('loginSuccess', null)
      // setTimeout(() => {
      //   toLogin()
      // }, 1000)
      // 404请求不存在
    case 404:
      // tip('请求的资源不存在')
      break
    default:
      // console.log(other)
  }
}

// 创建axios实例
const instance = axios.create({ timeout: 1000 * 15 })
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    config.url += config.url.includes('?') ? '&lang=zh_cn&source=web' : '?lang=zh_cn&source=web'
    return config
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      const { status, data } = response
      const message = status < 500 ? (data ? data.message : '未知错误') : `${status}: 服务器错误，请联系客服`
      const code = status < 500 ? (data ? data.code : '未知错误代码') : 'internal server error'
      errorHandle(status, message, code)
      return Promise.reject({
        status, message, code
      })
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false)
      // 手动给个400
      const status = 400
      const code = 'Network Error'
      const message = '请检查您的网络连接情况'
      errorHandle(status, message, code)
      return Promise.reject({
        status, message, code
      })
    }
  })

export default instance
