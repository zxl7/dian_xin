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
    return http.post('http://192.168.11.73:8081/WP/event/search', json)
  },

  // 投票
  postVoteCreateAPI (data) {
    return http.post('http://wsq.softspirit.cn/mobile/wsq/vote/create', data)
  },
  // 查询
  postVoteInfoAPI (data) {
    return http.post('http://wsq.softspirit.cn/mobile/wsq/vote/info', data)
  },

  // 进行中
  getVoteListSuccessAPI () {
    return http.get('/api/v4/tags/2/taggable_forms', '')
  },
  // 已结束
  getVoteListEndAPI () {
    return http.get('/api/v4/tags/3/taggable_forms', '')
  },
  // 三级页面header
  getVoteListAPI () {
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
