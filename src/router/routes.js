export default [
  {
    path: '/dian_xin/feedback',
    name: 'feedback',
    component: () => import(/* webpackChunkName:'feedback' */'@/components/feedback')
  },
  {
    path: '/dian_xin/vote',
    name: 'vote',
    component: () => import(/* webpackChunkName:'vote' */'@/components/vote')
  },
  {
    path: '/dian_xin/voting',
    name: 'voting',
    component: () => import(/* webpackChunkName:'voting' */'@/components/voting')
  },
  {
    path: '/dian_xin/activity',
    name: 'activity',
    component: () => import(/* webpackChunkName:'activity' */'@/components/activity')
  }
]
