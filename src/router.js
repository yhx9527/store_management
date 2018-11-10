import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/',
          name: 'login',
          component: Login
      },
    {
      path: '/',
      component: Home,
        children: [
            {
              path: '/product',
                component: ()=>import('./views/Product.vue')
            },
            {
                path: '/produce',
                component: ()=>import('./views/Produce.vue')
            },
            {
                path: '/output',
                component: ()=>import('./views/Output.vue')
            },
            {
                path: '/userinfo',
                component: ()=>import('./views/UserInfo.vue')
            },
            {
                path: '/fileout',
                component: ()=>import('./views/FileOut.vue')
            },
            {
                path: '/fileinproduce',
                component: ()=>import('./views/FileInProduce.vue')
            },
            {
                path: '/fileinproduct',
                component: ()=>import('./views/FileInProduct.vue')
            }
        ]

    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
