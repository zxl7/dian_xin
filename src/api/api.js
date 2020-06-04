import http from '../unit/http'
// import cookie from 'js-cookie'

// admin
// export default {
//   getMagnateOauthAPI () {
//     return http.get('/magnate/oauth')
//   }
// }

export default {
  postFeedBackListAPI (json) {
    return http.post('/WP/event/search', json)
  },
  // 投票
  getUnderwayVoteAPI (headers) {
    return http.get('/api/v4/categories/258/pages', '', headers)
  },
  getEndVoteAPI (headers) {
    return http.get('/api/v4/categories/259/pages', '', headers)
  },

  // 活动征集
  getActivityAPI (headers) {
    return http.get('/api/v4/categories/8/pages', '', headers)
  }

}
