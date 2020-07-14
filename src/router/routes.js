export default [
  {
    path: '/dian_xin/feedback',
    name: 'feedback',
    component: () => import(/* webpackChunkName:'feedback' */'@/components/view/feedback')
  },
  {
    path: '/dian_xin/vote',
    name: 'vote',
    component: () => import(/* webpackChunkName:'vote' */'@/components/view/vote')
  },
  {
    path: '/dian_xin/voting',
    name: 'voting',
    component: () => import(/* webpackChunkName:'voting' */'@/components/view/voting')
  },
  {
    path: '/dian_xin/activity',
    name: 'activity',
    component: () => import(/* webpackChunkName:'activity' */'@/components/view/activity')
  },
  {
    path: '/dian_xin/activity/pages',
    name: 'pages',
    component: () => import(/* webpackChunkName:'pages' */'@/components/view/pages')
  },
  {
    path: '/dian_xin/pages/comments',
    name: 'comments',
    component: () => import(/* webpackChunkName:'comments' */'@/components/view/comments')
  }
]
