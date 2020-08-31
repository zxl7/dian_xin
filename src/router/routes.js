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
  },
  {
    path: '/dian_xin/lyp/feedback',
    name: 'feedbackLyp',
    component: () => import(/* webpackChunkName:'feedback' */'@/components/lyp/feedback')
  },
  {
    path: '/dian_xin/lyp/vote',
    name: 'voteLyp',
    component: () => import(/* webpackChunkName:'vote' */'@/components/lyp/vote')
  },
  {
    path: '/dian_xin/lyp/voting',
    name: 'votingLyp',
    component: () => import(/* webpackChunkName:'voting' */'@/components/lyp/voting')
  },
  {
    path: '/dian_xin/lyp/activity',
    name: 'activityLyp',
    component: () => import(/* webpackChunkName:'activity' */'@/components/lyp/activity')
  },
  {
    path: '/dian_xin/lyp/apply',
    name: 'applyLyp',
    component: () => import(/* webpackChunkName:'apply' */'@/components/lyp/apply')
  },
  {
    path: '/dian_xin/lyp/activity/pages',
    name: 'pagesLyp',
    component: () => import(/* webpackChunkName:'pages' */'@/components/lyp/pages')
  },
  {
    path: '/dian_xin/lyp/pages/comments',
    name: 'commentsLyp',
    component: () => import(/* webpackChunkName:'comments' */'@/components/lyp/comments')
  }
]
