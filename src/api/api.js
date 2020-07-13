import http from '../unit/http'
// import cookie from 'js-cookie'

export default {
  // 工单查询
  postFeedBackListAPI (json) {
    return http.post('/mobile/wsq/WP/event/search', json)
  },

  // 投票
  postVoteCreateAPI (data) {
    return http.post('/mobile/wsq/vote/create', data)
  },
  // 查询
  postVoteInfoAPI (data) {
    return http.post('/mobile/wsq/vote/info', data)
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
  getVoteListAPI (url) {
    return http.get(url, '')
  },
  getVotingAPI (url) {
    return http.get(url)
  },

  // 活动征集
  getActivityAPI () {
    return http.get('/api/v4/categories/8/pages', '')
  },

  // 用户信息
  getUserAPI (data) {
    return http.get('/api/v4/users/query?keyword=' + data)
  },

  // 新建评论
  postCommentsAPI (data) {
    return http.post('/api/v4/comments', data)
  },

  // 查询评论
  getCommentsAPI (userId, pageId) {
    return http.get('/api/v4/comments?user_id=' + userId + ' &cms_page_id=' + pageId)
  }

}
