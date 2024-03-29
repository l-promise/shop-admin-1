/*
  配置路由
*/

import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件：
import Login from '@/components/login/Login'
import NotFound from '@/components/404/NotFound'

// 修改为按需加载的方式：
const Home = () => import('@/components/home/Home')
const Users = () => import('@/components/users/Users')
const Roles = () => import('@/components/roles/Roles')
const Rights = () => import('@/components/rights/Rights')
const Categories = () => import('@/components/categories/Categories')

// 通过特殊语法 /* webpackChunkName: "goods" */ 可以将多个组件合并为一个js文件输出
// 只要保证 webpackChunkName 的值相同即可
const Goods = () =>
  import(/* webpackChunkName: "goods" */ '@/components/goods/Goods')
const GoodsAdd = () =>
  import(/* webpackChunkName: "goods" */ '@/components/goods-add/GoodsAdd')

// import Home from '@/components/home/Home'
// import Users from '@/components/users/Users'
// import Roles from '@/components/roles/Roles'
// import Rights from '@/components/rights/Rights'
// import Categories from '@/components/categories/Categories'
// import Goods from '@/components/goods/Goods'
// import GoodsAdd from '@/components/goods-add/GoodsAdd'

// 安装插件
Vue.use(VueRouter)

// 创建路由实例，并导出
const router = new VueRouter({
  routes: [
    // 默认路由
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login, name: 'login' },
    {
      path: '/home',
      component: Home,
      name: 'home',

      // 子路由：
      children: [
        // 如果子路由的path带有 / ，那么，哈希值就是：/users
        // 如果子路由的path没有 / ，那么，哈希值就是：/home/users
        {
          // path: '/users',
          path: '/users',
          component: Users
        },

        {
          path: '/roles',
          component: Roles
        },

        {
          path: '/rights',
          component: Rights
        },

        {
          path: '/categories',
          component: Categories
        },

        {
          // :page 表示路由参数
          // :page? 表示路由参数为可选项，也就是说：可以传这个参数，也可以省略这个参数
          // /goods/:page? 这个路由规则，可以匹配一下形式的哈希值：
          //  /goods
          //  /goods/8
          path: '/goods/:page?',
          component: Goods
        },

        {
          path: '/goods-add',
          component: GoodsAdd
        }
      ]
    },

    // 通配符，可以匹配所有的路径，因此，这个路由规则应该出现在最后！！！
    // 优先匹配上述所有的路由规则，如果上面这些规则无法匹配，再匹配该路由
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  /*
    登录访问控制的思路：
    1 判断访问的是不是登录页面
    2 如果是，直接 next() 放行
    3 如果不是，就判断有没有登录
    4 如果没有登录，就跳转到登录页面，让用户登录
    5 如果登录了，就直接 next() 放行
  */
  if (to.path === '/login') {
    next()
    return
  }

  const token = localStorage.getItem('token')
  if (token) {
    // 登录
    next()
  } else {
    // 没有登录
    next('/login')
  }
})

// 导航守卫
// 全局导航守卫：任何一个路由的切换，都会经过全局导航守卫
/* router.beforeEach((to, from, next) => {
  // to 到哪去，也就是要导航到的路由
  // from 从哪来，也就是从哪个路由切换到了当前路由
  // next() 方法是放行的信号，必须调用这个方法，那么，组件的内容才会展示在页面中
  console.log('切换路由了，导航守卫执行了', localStorage.getItem('token'))
  // console.log('to:', to)
  // console.log('from:', from)

  next()
  // 其他使用方式：
  // next('/login') 参数 /login 就表示要跳转到的路由path，也就相当于：跳转路由
  // next('/login')
}) */

export default router
