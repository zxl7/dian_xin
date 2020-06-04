<template>
  <div>
    <!-- <header class="tabnar-header">
      <i @click="back" class="after"></i>
      我的反馈
    </header> -->
    <div class="banner">
      <div class="banner_title">
        <h1 class="banner_title_h1">我的反馈</h1>
        <p class="banner_title_p">Feedback</p>
      </div>
      <img alt class="tickling_img" src="@/assets/img/image_我的反馈.png" />
    </div>
    <div class="tickling_main">
      <van-list
        :finished="finished"
        :immediate-check="immediate_check"
        @load="onLoad"
        finished-text="没有更多了"
        v-model="loading"
      >
        <div :key="item.id" class="tickling_main_center" v-for="item in list">
          <aside class="tickling_main_left">
            <i class="icon-icon_baseline-feedback"></i>
          </aside>
          <aside class="tickling_main_right">
            <h2 v-if="item.type1 ==1">咨询</h2>
            <h2 v-if="item.type1 ==2">求助</h2>
            <h2 v-if="item.type1 ==3">建议</h2>
            <h2 v-if="item.type1 ==4">投诉</h2>
            <h2 v-if="item.type1 ==5">其他</h2>
            <h3>{{item.detail}}</h3>
            <p>
              <span>{{item.createTime}}</span>
              <span class v-if="item.status == 0">待领取</span>
              <span class="in_head" v-if="item.status == 1">处理中</span>
              <span class="end" v-if="item.status == 2">完结</span>
              <span class v-if="item.status == 3">退单</span>
              <span class v-if="item.status == 5">转派天阙</span>
            </p>
            <p class="tickling_main_right_reply">{{item.dealSubjust}}</p>
          </aside>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      immediate_check: false,
      loadNum: 1

    }
  },
  mounted () {
    let json = {
      'pageNum': this.loadNum,
      'pageSize': '30'
    }
    api.postFeedBackListAPI(json).then(res => {
      if (res.status === 200) { this.list = res.data.data.list }
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    // 分页器
    onLoad () {
      this.loadNum++
      this.loading = true
      let json = {
        'pageNum': this.loadNum,
        'pageSize': '30'
      }
      api.postFeedBackListAPI(json).then(res => {
        if (res.status === 200) {
          let oldList = this.list
          let newList = res.data.data.list
          this.list = [...oldList, ...newList]
          this.loading = false
          console.log(res)

          if (!res.data) {
            this.loading = false
            this.finished = true
          }
        }
      })
    }
  }
}
</script>

<style lang="scss"  scoped>
.tabnar-header {
  text-align: center;
  position: relative;
  font-size: 16px;
  font-weight: 600;
  color: #222;
  height: 50px;
  line-height: 50px;
}
.after {
  position: absolute;
  left: 10px;
}
.after:after {
  border-top: 5px solid #555555;
  border-bottom: 5px solid transparent;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  content: '';
  display: inline-block;
  transform: rotate(90deg);
  position: relative;
  width: 0;
}
.tickling_img {
  width: 100%;
  height: 120px;
}

.banner {
  position: relative;
  .banner_title {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 40px;
    color: white;

    .banner_title_h1 {
      text-align: left;
      font-size: 20px;
    }
    .banner_title_p {
      color: #de7c6d;
      text-align: left;
      font-size: 13px;
    }
  }
}
.tickling_main {
  border-radius: 8px;
  background: #fff;
  height: 520px;
  position: absolute;
  width: 100%;
  top: 114px;
}

.tickling_main_center {
  display: flex;
  margin: 0px 20px;
  padding: 24px 0px 20px;
  border-bottom: 1px solid #f4f4f5;
}

.tickling_main_left {
  background: #2196f3;
  width: 40px;
  height: 40px;
  border-radius: 6px;
}

.tickling_main_right {
  margin-left: 16px;
  width: 100%;

  h2 {
    text-align: left;
    font-size: 16px;
    font-weight: 500;
  }
  h3 {
    margin-top: 8px;
    text-align: left;
    color: #95a4b3;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1.5px;
    word-break: break-word;
  }
  p {
    margin-top: 8px;
    display: flex;
    text-align: left;
    color: #95a4b3;
    justify-content: space-between;

    span {
      padding: 2px 8px;
      border-radius: 12px;
      background: #f4f4f8;
    }
  }

  .tickling_main_right_reply {
    margin-top: 20px;
  }
  .in_head {
    color: #ffc637;
    background: #fff9ec;
  }
  .end {
    color: #2196f3;
    background: #e8f4fd;
  }
}
</style>
