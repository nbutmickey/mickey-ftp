// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faAngleLeft,faAngleRight} from '@fortawesome/free-solid-svg-icons'
import 'element-ui/lib/theme-chalk/index.css'
import './style/base.css'
Vue.config.productionTip = false;
import axios from 'axios'
//引入font-awesome-icon的全局配置
library.add(faAngleLeft,faAngleRight);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(ElementUi);
Vue.prototype.$axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
