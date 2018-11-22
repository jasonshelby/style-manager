import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/home'
import demo from '../views/demo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      component: home
    },
    {
      path: '/demo',
      component: demo
    }
  ]
})
