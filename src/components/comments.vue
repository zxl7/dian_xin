<template>
  <div class="comment">
    <header class="header layer-page-title">
      <div class="layer-page-title-content">
        <div class="comment-operates">
          <a @click="goBack" class="comment-cancel">取消</a>
          <span @click="commentSend()" class="comment-send">发送</span>
        </div>
      </div>
    </header>
    <div class="comment-section">
      <textarea
        autofocus="autofocus"
        class="comment-input"
        placeholder="想对 这是一条测试数据 说点什么..."
        rows="10"
        v-model="message"
      />
    </div>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  data () {
    return {
      message: ''
    }
  },
  mounted () {
    this.pageId = this.$route.query.pageId
    this.userId = this.$route.query.userId
  },
  methods: {
    commentSend () {
      let data = {
        'comment': {
          'body': this.message
        },
        'user_id': this.userId,
        'cms_page_id': this.pageId
      }

      api.postCommentsAPI(data).then(res => {
        if (res.status === 200) {
          this.$toast.success('评论成功')
          setTimeout(() => {
            // 延迟跳转
            this.$router.go(-1)
          }, 1500)
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }

}
</script>

<style lang="scss" scoped>
.header {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  height: 50px;
  background-color: white;
  max-width: 37.5rem;
  width: 100%;
  z-index: 10;
  overflow: hidden;
}
.layer-page-title {
  text-align: center;
  font-size: 16px;
  color: #615f6c;
  .layer-page-title-content {
    width: 100%;
  }

  .comment-operates {
    line-height: 50px;
    display: flex;
    text-align: center;
    justify-content: space-between;
    padding: 0 0.75rem;
  }

  .comment-send {
    color: #fd7d58;
  }
}

.comment-section {
  background-color: #fff;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  margin-bottom: 0.5rem;
  display: block;
  padding-top: 1rem;
  padding-bottom: 1rem;

  .comment-input {
    margin: 10px;
    border: none;
    outline: none;
    background: none;
    min-height: 1em;
    vertical-align: middle;
    box-shadow: none;
    font-size: inherit;
    border-radius: 0;
    line-height: 1.5em;
    width: 100%;
    font-size: 16px;
    padding: 10px;
  }
}

input::placeholder,
textarea::placeholder {
  color: #ddd;
  font-size: 16px;
}
</style>
