import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ListDownloaded from '@/components/ListDownloaded'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/downloaded',
      name: 'Downloaded',
      component: ListDownloaded
    }
  ]
})
