import Vue from 'vue'
import Vuex from 'vuex'
import State from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: new State(),
  mutations,
  actions,
  getters: {},
  modules: {}
})

export enum Commits {
  SET_USER='setUser'
}

export enum Actions {
  GET_USER='getUser'
}