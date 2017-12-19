import Vue from 'vue';
import Vuex from 'vuex';
import VueSocketio from 'vue-socket.io';
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
  getters: {
    sortedTags: state => {
      var idx = state.sortBy;
      return state.tags.sort(function (a, b) {
        if (a[idx] === b[idx]) return 0;
        return (a[idx] < b[idx]) ? 1 * state.di : -1 * state.di;
      });
    }
  },
  mutations: {
    SOCKET_CONNECT: (state, status) => {
      state.isConnected = true;
    },
    SOCKET_DISCONNECT: (state, status) => {
      //console.log('disconnected');
      state.isConnected = false;
    },
    addMessage: (state, message) => {
      var msg = [message, ...state.message];
      msg = msg.splice(0, 20);
      state.message = msg;
    },
    addTags: (state, tags) => {
      state.updatedAt = tags[0].updatedAt;
      var ret = state.tags;
      var toAdd = [];
      for (var i in tags) {
        var tagId = tags[i].tagId;
        var idx=ret.findIndex(aTag => aTag.tagId == tagId);
        if (idx <0) {
          toAdd.push(tags[i]);
        }else{
          ret[idx]=tags[i];
        }
      }
      state.tags = [...ret, ...toAdd];
    }
  },
  actions: {
    socket_tagStat: ({
      commit,
      state
    }, message) => {
      //context.
      commit('addMessage', message);
      axios.post('/apinaja/runnersWithData/' + state.updatedAt).then(resp => {
        if (resp.data.length > 0) {
          commit('addTags', resp.data);
        }
      });
      //console.log('tagStat',message);
    }
  }
});
Vue.use(VueSocketio, 'https://yattaweb.herokuapp.com/', store);
//Vue.use(VueSocketio, 'http://localhost:3000', store);
export default store;
