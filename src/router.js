import Vue from 'vue'
import VueRouter from 'vue-router'

import user from './components/user.vue'
import eleTest from './components/ele-test.vue'
import slotTest from './components/parent.vue'

import flowChart from './components/flow-chart.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/user',
      component: user
    },
    {
      path: '/ele-test',
      component: eleTest
    },
    {
      path: '/slot-test',
      component: slotTest
    },
    {
      path: '/flow-chart',
      component: flowChart
    }
  ]
})
