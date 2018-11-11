import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    setToken(state, token){
      state.token = token
      axios.defaults.headers.Authorization = 'Bearer ' + token
    },
      setUserInfo(state, playload) {
        state.userInfo = playload.userInfo
      },
      clear(state) {
        state.token = ''
          state.userInfo = {}
      }
  },
  actions: {

  }
})
