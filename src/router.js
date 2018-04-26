import Vue from 'vue'
import VueRouter from 'vue-router'

import user from './components/user.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/user',
      component: user
    }
  ]
})
