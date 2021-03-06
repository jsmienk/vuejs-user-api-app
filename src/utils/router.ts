import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import { requireAuth } from '@/utils/api/auth'
import Main from '@/components/views/Main.vue'
import Account from '@/components/views/auth/Account.vue'
import Register from '@/components/views/auth/Register.vue'
import ErrorPage from '@/components/views/Error.vue'


export enum Pages {
  MAIN='MAIN',
  REGISTER='REGISTER',
  ACCOUNT='ACCOUNT',
  PROFILE='PROFILE',
  ERROR='ERROR'
}

export function PageRoutes(page: Pages, args?: [any]): string {
  switch (page) {
    case Pages.MAIN:     return `/`
    case Pages.REGISTER: return `/register`
    case Pages.ACCOUNT:  return `/account`
    case Pages.PROFILE:  return `/user/${args && args.length > 0 ? args[0] : ''}`
    default: return '/404'
  }
}

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/account',
      name: 'Account',
      beforeEnter: requireAuth,
      component: Account
    },
    {
      path: '*',
      name: 'Page Not Found',
      component: ErrorPage
    }
  ]
})
