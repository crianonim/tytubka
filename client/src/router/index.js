import Vue from 'vue'
import Router from 'vue-router'
import ListDownloaded from '@/components/ListDownloaded'
import Main from '@/components/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/downloaded',
      name: 'Downloaded',
      component: ListDownloaded
    }
  ]
})
