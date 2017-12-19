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
    message:[]
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
      state.needInitRaceName = true;
    },
    SOCKET_DISCONNECT: (state, status) => {
      //console.log('disconnected');
      state.isConnected = false;
    },
    SOCKET_TAGS: (state, tags) => {
      //console.log('new tags!!');
      state.tags = [...state.tags, ...tags];
    },
    SOCKET_CLEARTAGS: (state, data) => {
      //console.log('clear tags!!');
      state.tags = [];
    },
    SOCKET_CURRTAGS: (state, tags) => {
      //console.log('current tags!!');
      state.tags = tags;
    },
    addMessage:(state,message)=>{
      var msg=[message,...state.message];
      msg=msg.splice(0,20);
      state.message=msg;
    }
  },
  actions: {
    socket_tagStat: (context, message) => {
      //context.
      context.commit('addMessage',message);
      console.log(context);
      //console.log('tagStat',message);
    }
  }
});
Vue.use(VueSocketio, 'https://yattaweb.herokuapp.com/', store);
//Vue.use(VueSocketio, 'http://localhost:3000', store);
export default store;
