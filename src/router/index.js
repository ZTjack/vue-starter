import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/views/Home'

const Home = () => import(/* webpackChunkName: "views-home" */ '@/views/Home')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '1Token|数字货币行业的专业级券商+期货公司'
      }
    }
  ]
})


