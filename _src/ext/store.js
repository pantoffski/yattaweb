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
  getters: {},
  mutations: {
    SOCKET_CONNECT: (state, status) => {
      state.isConnected = true;
    },
    SOCKET_DISCONNECT: (state, status) => {
      //console.log('disconnected');
      state.isConnected = false;
    },
    addMessage: (state, message) => {
      var d=new Date();
      message=d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+' - '+message;
      var msg = [message, ...state.message];
      msg = msg.splice(0, 20);
      state.message = msg;
    },
    clearTag: (state, tags) => {
      state.tags = []
    },
    addTags: (state, tags) => {
      state.updatedAt = tags[0].updatedAt;
      var ret = state.tags;
      var toAdd = [];
      for (var i in tags) {
        var tagId = tags[i].tagId;
        var idx = ret.findIndex(aTag => aTag.tagId == tagId);
        if (idx < 0) {
          toAdd.push(tags[i]);
        } else {
          ret[idx] = tags[i];
        }
      }
      state.tags = [...ret, ...toAdd];
    }
  },
  actions: {
    socket_tagStat: ({
      commit,
      dispatch
    }, message) => {
      //context.
      commit('addMessage', message);
      dispatch('getData');
      //console.log('tagStat',message);
    },
    getData: ({
      commit,
      state
    }) => {
      axios.post('/apinaja/runnersWithData/' + state.updatedAt).then(resp => {
        if (resp.data.length > 0) {
          commit('addTags', resp.data);
        }
      });
    }
  }
});
Vue.use(VueSocketio, 'https://yattaweb.herokuapp.com/', store);
//Vue.use(VueSocketio, 'http://localhost:3000', store);
export default store;
