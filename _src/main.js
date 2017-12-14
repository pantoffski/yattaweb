//require('./css/font-awesome/less/font-awesome.less');
//require('./css/bootstrap/less/bootstrap.less');
//require('./css/adminlte/AdminLTE-without-plugins.less');
//require('./css/adminlte/skins/_all-skins.less');
import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import router from './ext/router.js'
import store from './ext/store.js'
import App from './App.vue'
import VueSocketio from 'vue-socket.io';
//import vueResource from 'vue-resource'
// import * as uiv from 'uiv'
// Vue.use(uiv)
Vue.use(Vuex);
Vue.prototype.$http = axios;
//Vue.http.options.root = 'http://localhost';
// Vue.config.productionTip = false;
// Vue.http.options.emulateHTTP = true;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  sockets: {},
  components: {
    App
  }
  ,
  created() {
    console.log('app created');
    this.$store.dispatch('init');
  }
})
// window.App=App;
//window.Vue = Vue;
