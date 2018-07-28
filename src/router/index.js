import Vue from 'vue'
import Router from 'vue-router'
import ftp from '@/components/ftp'
import login from '@/components/login'
Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
    path:'/',
  name:'ftp',
  component:ftp
    },
    {
      path:'/login',
      name:'login',
      component:login
    }
  ]
})
