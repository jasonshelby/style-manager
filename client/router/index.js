import Vue from 'vue'
import Router from 'vue-router'
import styleMmanager from '../views/style-manager'
import demo from '../views/demo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/style-manager',
      component: styleMmanager
    },
    {
      path: '/demo',
      component: demo
    }
  ]
})
