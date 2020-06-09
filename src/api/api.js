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
  getUnderwayVoteAPI () {
    return http.get('/api/v4/categories/258/pages', '')
  },
  getEndVoteAPI () {
    return http.get('/api/v4/categories/259/pages', '')
  },
  getVoteAPI () {
    return http.get('/api/v4/tags/2/taggable_forms', '')
  },
  getVotingAPI (url) {
    return http.get(url)
  },

  // 活动征集
  getActivityAPI () {
    return http.get('/api/v4/categories/8/pages', '')
  }

}
