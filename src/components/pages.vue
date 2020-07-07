<template>
  <div class="page">
    <header class="page-header">
      <div class="page-title">{{dataObj.title}}</div>
      <div class="page-created_at">{{dataObj.dateTime}}</div>
      <span>阅读量: {{dataObj.read_count}}</span>
    </header>
    <div class="page-content" v-html="dataObj.html_body"></div>
    <div class="page-comments">
      <div class="page-comments-divider"></div>
      <div class="page-comments-header">
        <span>评论</span>
        <router-link :to="{name:'comments',query:{pageId:this.pageId}}">写短评</router-link>
      </div>

      <div class="no-page-comments">
        <span>这篇文章还没有评论</span>
      </div>

      <div class="page-comments-list">
        <div class="page-comment-item">
          <div class="comment-author-header">
            <img
              alt="author-header"
              src="http://thirdwx.qlogo.cn/mmopen/vi_32/jBy8W5IyGw9sBjQFQsB7bC7OgvIgwDUGicL4HLO2QT6O3wDDGFicxf9Wy4YAh3iasWB7HsNL2UBauU7DkpoCuggTA/64"
            />
          </div>
          <div class="comment-details">
            <div class="comment-author-name">郑薛林</div>
            <div class="comment-body">增加一条评论</div>
            <div class="comment-created_at">2020-07-07 14:23</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  data () {
    return {
      pageId: {
        type: Number,
        default: 0
      },
      dataObj: ''

    }
  },
  mounted () {
    this.pageId = this.$route.query.pageId

    api.getActivityAPI().then(res => {
      res.data.forEach(ele => {
        // eslint-disable-next-line eqeqeq
        if (ele.id.toString() == this.pageId) {
          this.dataObj = ele
          let dateTime = this.dataObj.created_at
          let firstdateTime = dateTime.slice(0, 10)
          let lastdateTime = dateTime.slice(11, 16)
          dateTime = firstdateTime + ' ' + lastdateTime
          this.dataObj.dateTime = dateTime
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
  flex-grow: 1;
  padding: 0 10px;
  background-color: white;
}
.page-header {
  text-align: left;
  font-size: 16px;
  border-bottom: 1px solid #e9e9e9;

  .page-title {
    font-size: 20px;
    color: #615f6c;
    font-weight: bold;
  }

  .page-created_at {
    font-size: 13px;
    color: #bcbcbc;
  }
}
.page-header > * {
  margin: 15px 0;
}

.page-content {
  font-size: 14px;
  font-family: arial, sans-serif;
  color: #333;
  outline: none;
  word-wrap: break-word;
  text-align: left;
  line-height: 24px;
  margin-bottom: 10px;
}

.page-comments {
  .page-comments-divider {
    margin: 0 -10px;
    background-color: #f2f2f2;
    height: 10px;
    box-shadow: inset 0 1px 1px 0 rgba(100, 100, 100, 0.1);
  }

  .page-comments-header {
    margin: 0 -10px;
    border-bottom: 1px solid #e9e9e9;
    padding: 15px 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 15px;
    flex-direction: row;
    align-items: center;
    text-align: left;

    span {
      flex-grow: 1;
      width: 0.5rem;
      color: #615f6c;
    }

    a {
      font-size: 14px;
      color: #fd7d58;
    }
  }
  .no-page-comments {
    font-size: 14px;
    text-align: center;
    color: #888888;
    padding: 10px 0;
  }
}

.page-comment-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 23px 0;

  .comment-author-header {
    margin-right: 8px;
    width: 33px;
    height: 33px;

    img {
      width: 100%;
      display: block;
      border-radius: 50%;
    }
  }
  .comment-details {
    text-align: left;
    flex-grow: 1;
    width: 0.5rem;
    .comment-author-name {
      font-size: 13px;
      color: #888;
      line-height: 1.5em;
      position: relative;
    }
    .comment-body {
      font-size: 14px;
      color: #615f6c;
      line-height: 1.5em;
      padding: 4px 0;
    }
    .comment-created_at {
      font-size: 12px;
      color: #bcbcbc;
    }
  }
}
</style>
