import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {},
      categories: []
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
          state.categories = []
      },
      setCategories(state, categories){
        state.categories = categories
      }
  },
  actions: {

  }
})
