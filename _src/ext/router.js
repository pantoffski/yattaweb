import Vue from 'vue'
import Router from 'vue-router'
import raceViewer from '@/components/RaceViewer'
Vue.use(Router)
export default new Router({
  mode: 'history',
  base: '/',
  routes: [{
    path: '/',
    name: 'raceViewer',
    component: raceViewer,
    props: true
  },{
    path: '*',
    redirect: '/'
  }]
})
