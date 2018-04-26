import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 0
}

const mutations = {
  add (state, n) {
    state.count += n
  },
  reduce (state, n) {
    state.count -= n
  }
}

const getters = {
  newCount (state) {
    return state.count + 100
  }
}

const actions = {
  add (context) {
    context.commit('add', 10)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

export default store
