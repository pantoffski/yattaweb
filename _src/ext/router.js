import Vue from 'vue'
import Router from 'vue-router'
import raceViewer from '@/components/RaceViewer'
import howTo from '@/components/HowTo'
Vue.use(Router)
export default new Router({
  mode: 'history',
  base: '/',
  routes: [{
    path: '/:raceName/',
    name: 'raceViewer',
    component: raceViewer,
    props: true
  }, {
    path: '/',
    name: 'howTo',
    component: howTo
  }, {
    path: '*',
    redirect: '/'
  }]
})
