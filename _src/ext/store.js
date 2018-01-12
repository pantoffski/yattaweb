import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    isConnected: false,
    needInitRaceName: false,
    sortBy: 2,
    di: 1,
    updatedAt: 0,
    tags: [],
    message: []
  },
  getters: {},
  mutations: {
  },
  actions: {
  }
});
export default store;
