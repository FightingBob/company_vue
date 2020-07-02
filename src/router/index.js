import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'home', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/mobile/food',
    component: () => import('@/views/mobile/food/index'),
    name: 'orderFood',
    meta: { title: '点餐', icon: 'canteen-food', noCache: true }
  },
  {
    path: '/mobile/drink',
    component: () => import('@/views/mobile/drink/index'),
    name: 'store',
    meta: { title: '零售区', icon: 'canteen-drink', noCache: true }
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/canteen',
    component: Layout,
    redirect: 'canteen/food',
    name: 'canteen',
    meta: { title: '点餐管理', icon: 'canteen' },
    children: [
      {
        path: 'menu',
        name: 'canteen-menu',
        component: () => import('@/views/canteen/menu/index'),
        meta: { title: '美食菜单', icon: 'canteen-menu', noCache: true }
      },
      {
        path: 'drink',
        name: 'drink',
        component: () => import('@/views/canteen/drink/index'),
        meta: { title: '饮料列表', icon: 'canteen-drink' }
      },
      {
        path: 'retail',
        name: 'retail',
        component: () => import('@/views/canteen/retail/index'),
        meta: { title: '零售区', icon: 'canteen-retail' }
      },
      {
        path: 'select',
        name: 'select',
        component: () => import('@/views/canteen/select/index'),
        meta: { title: '下单', icon: 'canteen-select' }
      }
    ]
  },
  {
    path: '/supplies',
    component: Layout,
    redirect: 'supplies/list',
    name: 'supplies',
    meta: { title: '物资管理', icon: 'supplies' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/supplies/list/index'),
        meta: { title: '物资列表', icon: 'supplies-list' }
      },
      {
        path: 'record',
        name: 'record',
        component: () => import('@/views/supplies/record/index'),
        meta: { title: '导入物资', icon: 'supplies-record' }
      },
      {
        path: 'importAdmin',
        name: 'importAdmin',
        component: () => import('@/views/supplies/list/importAdmin'),
        meta: { title: '导入物资', icon: 'ums-import' },
        hidden: true
      }

    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: 'finance/income',
    name: 'finance',
    meta: { title: '财务管理', icon: 'finance' },
    children: [
      {
        path: 'income',
        name: 'income',
        component: () => import('@/views/finance/income/index'),
        meta: { title: '收入列表', icon: 'finance-income' }
      },
      {
        path: 'expend',
        name: 'expend',
        component: () => import('@/views/finance/expend/index'),
        meta: { title: '支出列表', icon: 'finance-expend' }
      },
      {
        path: 'myExpend',
        name: 'myExpend',
        component: () => import('@/views/finance/myExpend/index'),
        meta: { title: '个人支出', icon: 'finance-expend' }
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: { title: '权限管理', icon: 'ums' },
    children: [
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/ums/department/index'),
        meta: { title: '部门列表', icon: 'ums-department' }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index'),
        meta: { title: '用户列表', icon: 'ums-admin' }
      },
      {
        path: 'importAdmin',
        name: 'importAdmin',
        component: () => import('@/views/ums/admin/importAdmin'),
        meta: { title: '导入用户列表', icon: 'ums-import' },
        hidden: true
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: { title: '角色列表', icon: 'ums-role' }
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu'),
        meta: { title: '分配菜单' },
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource'),
        meta: { title: '分配资源' },
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index'),
        meta: { title: '菜单列表', icon: 'ums-menu' }
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/ums/menu/add'),
        meta: { title: '添加菜单' },
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/ums/menu/update'),
        meta: { title: '修改菜单' },
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index'),
        meta: { title: '资源列表', icon: 'ums-resource' }
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList'),
        meta: { title: '资源分类' },
        hidden: true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
