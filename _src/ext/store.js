import Vue from 'vue';
import Vuex from 'vuex';
import VueSocketio from 'vue-socket.io';
import Dexie from 'dexie';
Vue.use(Vuex);
var db;
// Define a schema
// db.friends.add({
// 		name: 'Mai',
// 		age: 35
// 	});
const store = new Vuex.Store({
  state: {
    isConnected: false,
    needInitRaceName: false,
    sortBy: 2,
    di: 1,
    updatedAt: 0,
    tags: []
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
    doneInitRaceName(state) {
      state.needInitRaceName = false;
    },
    sortByMatId(state) {
      if (state.sortBy != 0) {
        state.sortBy = 0;
        state.di = 1;
      } else {
        state.di = state.di * -1;
      }
    },
    sortByTagId(state) {
      if (state.sortBy != 1) {
        state.sortBy = 1;
        state.di = 1;
      } else {
        state.di = state.di * -1;
      }
    },
    sortBytStamp(state) {
      if (state.sortBy != 2) {
        state.sortBy = 2;
        state.di = 1;
      } else {
        state.di = state.di * -1;
      }
    }
  },
  actions: {
    async initDb(context) {
      db = new Dexie('MyDatabase');
      db.version(1).stores({
        runners: 'tagId, &bibNo, raceCat, updatedAt'
      });
      db.open().then(function () {
        return Promise.resolve();
      }).catch(function (error) {
        alert('error !');
      });
    },
    async init({
      dispatch,
      state
    }) {
      await dispatch('initDb');
      db.runners.where('updatedAt').above(0).desc().limit(1).each(function (f) {
        if (f) state.updatedAt = f.updatedAt;
      }).then(() => dispatch('initData'));
    },
    initData(context) {
      console.log('initData');
      var inp = [{
        "tagId": 73,
        "bibNo": 80,
        "bibName": "Lhongg",
        "name": "พีระพจน์ เดียวจิตเจริญ",
        "raceCat": "30m",
        "updatedAt": 1513156713285
      }];
      db.runners.bulkPut(inp).then((res) => {
        console.log('success ', res)
      }).catch((err) => {
        console.log('error ', err);
      });
      db.runners.each(function (f) {
        console.log(f);
      });
    },
    async bar(context) {
      console.log('bar', context);
      var f = await db.runners.where('updatedAt').above(0).desc().limit(1);
      console.log('aaaa', f.count());
      db.runners.where('bibNo').equals(80).modify({
        bibName: 'Lhong',
        raceCat: '30m'
      });
      db.runners.get({
        bibNo: 80
      }).then(function (f) {
        console.log(f);
      });
    }
  }
});
//Vue.use(VueSocketio, 'https://yattaweb.herokuapp.com/', store);
Vue.use(VueSocketio, 'http://localhost:3000', store);
export default store;
