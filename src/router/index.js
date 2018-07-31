import Vue from 'vue'
import Router from 'vue-router'
import ftp from '@/components/ftp'
import list from '@/components/list'
import login from '@/components/login'
Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/',
      name:'list',
      component:list
    },
    {
      path:'/login',
      name:'login',
      component:login
    }
  ]
})
