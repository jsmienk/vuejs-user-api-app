import Vue from 'vue'
import App from './App.vue'
import router from '@/utils/router'
import store from '@/utils/store'
import i18n from '@/utils/i18n'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
