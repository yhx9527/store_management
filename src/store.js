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
  getters: {
    getToken(state) {
      if(state.token === '') {
        state.token = window.localStorage.getItem('token')
        axios.defaults.headers.Authorization = 'Bearer ' + state.token
      }
      return state.token
    },
    getUserInfo(state) {
      if(Object.keys(state.userInfo).length === 0) {
        state.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      }
      return state.userInfo
    },
    getCategories(state) {
      if(state.categories.length === 0) {
        state.categories = window.localStorage.getItem('categories')
      }
      return state.categories
    }
  },
  mutations: {
    setUser(state, data) {
      state.token = data.token
      state.userInfo = data.userInfo
      axios.defaults.headers.Authorization = 'Bearer ' + data.token
      window.localStorage.setItem('token', data.token)
      window.localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
      clear(state) {
        state.token = ''
          state.userInfo = {}
          state.categories = []
          window.localStorage.clear()
      },
      setCategories(state, categories){
        state.categories = categories
        window.localStorage.setItem('categories', JSON.stringify(categories))
      }
  },
  actions: {

  }
})
