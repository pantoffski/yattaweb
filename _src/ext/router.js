import Vue from 'vue'
import Router from 'vue-router'
import raceViewer from '@/components/RaceViewer'
import scoreBoard from '@/components/ScoreBoard'
Vue.use(Router)
export default new Router({
  mode: 'history',
  base: '/',
  routes: [{
    path: '/',
    name: 'raceViewer',
    component: raceViewer
  },{
    path: '/scoreBoard',
    name: 'scoreBoard',
    component: scoreBoard
  },{
    path: '*',
    redirect: '/'
  }]
})
