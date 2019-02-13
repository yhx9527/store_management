import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import cookie from './utils/cookie'
import store from './store'

Vue.use(Router)

const userBan = ['output-fileout', 'filein', 'userinfo']
const operatorBan = ['userinfo']
const router = new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  routes: [
      {
          path: '/login',
          name: 'login',
          component: Login
      },
    {
      path: '/',
      component: Home,
        meta: {
          requireAuth: true
        },
        children: [
            {
              path: '/(produce)?',
                name: 'produce',
                component: ()=>import('./views/Produce.vue')
            },
            {
                path: '/product/form/:productId?',
                name: 'productForm',
                props:true,
                component: ()=>import('./components/ProductForm.vue')
            },
            {
                path: '/userinfo/form/:userInfoId?',
                name: 'userForm',
                component: ()=>import('./components/UserForm.vue')
            },
            {
                path: '/product',
                name: 'product',
                component: ()=>import('./views/Product.vue')
            },
            {
                path: '/product/category',
                name: 'category',
                component: ()=>import('./components/Category.vue')
            },
            {
                path: '/product/:productId?/photo',
                name: 'photo',
                component: ()=>import('./views/Photo.vue')
            },
            {
                path: '/produce/add',
                name: 'produce-add',
                component: ()=>import('./components/ProduceAdd.vue')
            },
            {
                path: '/output',
                name: 'output',
                component: ()=>import('./views/Output.vue')
            },
            {
                path: '/userinfo',
                name: 'userinfo',
                component: ()=>import('./views/UserInfo.vue')
            },
            {
                path: '/output/fileout',
                name: 'output-fileout',
                component: ()=>import('./views/FileOut.vue')
            },
            {
                path: '/:name/filein',
                name: 'filein',
                component: ()=>import('./views/FileInProduct.vue')
            },
            {
                path: '/changePwd',
                name: 'changePwd',
                component: ()=>import('./views/ChangePwd.vue')
            },
            {
                path: '/profile',
                name: 'profile',
                component: ()=>import('./views/Profile.vue')
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

router.beforeEach((to, from, next)=>{
    if (to.matched.some((r)=>{return r.meta.requireAuth})){
        console.log('gettoken',store.getters.getToken)
        if (store.getters.getToken){
            let auth = store.getters.getUserInfo.userInfoRoles
            if((auth === 'USER' && userBan.includes(to.name)) || (auth === 'OPERATOR' && operatorBan.includes(to.name))) {
                next(from.path)
            } else {
                next()
            }
        } else {
            next({
                name: 'login'
            })
        }
    } else {
        next()
    }
})

export default router
