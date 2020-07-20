<template>
  <div>
    <div class="banner">
      <div class="banner_title">
        <h1 class="banner_title_h1">社区投票</h1>
        <p class="banner_title_p">Community voting</p>
      </div>
      <img alt class="vote_img" src="@/assets/img/image_社区投票.png" />
    </div>
    <div class="vote_main">
      <van-tabs type="card" v-model="active">
        <van-tab title="全部投票">
          <div :key="item.id" v-for="(item,index) in  listUnderway">
            <router-link
              :to="{name:'voting',query:{tableId:item.id,userIndex:index,openid:item.openid,type:2}}"
              class="vote_a"
            >
              <div class="vote_main_center">
                <aside class="vote_main_left">
                  <h2>{{item.title}}</h2>
                  <h3>{{toText(item.description)}}</h3>
                  <p>
                    <span>{{item.DataTime}}</span>
                    <span class="underway">进行中</span>
                  </p>
                </aside>
                <aside class="vote_main_right">
                  <img :src="toImg(item.description)" class="vote_main_right_img" />
                </aside>
              </div>
            </router-link>
          </div>
          <div :key="item.id" v-for="(item,index) in listEnd">
            <router-link
              :to="{name:'voting',query:{tableId:item.id,userIndex:index,openid:item.openid,type:3}}"
              class="vote_a"
            >
              <div class="vote_main_center">
                <aside class="vote_main_left">
                  <h2>{{item.title}}</h2>
                  <h3>{{toText(item.description)}}</h3>
                  <p>
                    <span>{{item.DataTime}}</span>
                    <span class="end">已结束</span>
                  </p>
                </aside>
                <aside class="vote_main_right">
                  <img :src="toImg(item.description)" class="vote_main_right_img" />
                </aside>
              </div>
            </router-link>
          </div>
        </van-tab>

        <van-tab title="进行中">
          <div :key="item.id" v-for="(item,index) in  listUnderway">
            <router-link
              :to="{name:'voting',query:{tableId:item.id,userIndex:index,openid:item.openid,type:2}}"
              class="vote_a"
            >
              <div class="vote_main_center">
                <aside class="vote_main_left">
                  <h2>{{item.title}}</h2>
                  <h3>{{toText(item.description)}}</h3>
                  <p>
                    <span>{{item.DataTime}}</span>
                    <span class="underway">进行中</span>
                  </p>
                </aside>
                <aside class="vote_main_right">
                  <img :src="toImg(item.description)" class="vote_main_right_img" />
                </aside>
              </div>
            </router-link>
          </div>
        </van-tab>
        <van-tab title="已结束">
          <div :key="item.id" v-for="(item,index) in listEnd">
            <router-link
              :to="{name:'voting',query:{tableId:item.id,userIndex:index,openid:item.openid,type:3}}"
              class="vote_a"
            >
              <div class="vote_main_center">
                <aside class="vote_main_left">
                  <h2>{{item.title}}</h2>
                  <h3>{{toText(item.description)}}</h3>
                  <p>
                    <span>{{item.DataTime}}</span>
                    <span class="end">已结束</span>
                  </p>
                </aside>
                <aside class="vote_main_right">
                  <img :src="toImg(item.description)" class="vote_main_right_img" />
                </aside>
              </div>
            </router-link>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
export default {
  data () {
    return {
      listEnd: [],
      listUnderway: [],
      loading: false,
      finished: false,
      immediate_check: false,
      loadNum: 1,
      active: 0,
      openid: '',
      mobile: ''
    }
  },
  created () {
    this.openid = this.$route.query.openid
    this.mobile = this.$route.query.mobile
  },
  mounted () {
    api.getVoteListSuccessAPI().then(res => {
      if (res.status === 200) {
        this.listUnderway = res.data
        // console.log(res)

        for (let i = 0; i < this.listUnderway.length; i++) {
          let DataTime = this.listUnderway[i].created_at
          let firstDataTime = DataTime.slice(0, 10)
          let lastDataTime = DataTime.slice(11, 19)
          DataTime = firstDataTime + ' ' + lastDataTime
          this.listUnderway[i].DataTime = DataTime
          this.listUnderway[i].openid = this.openid
          this.listUnderway[i].mobile = this.mobile
        }
      }
    })
    api.getVoteListEndAPI().then(res => {
      if (res.status === 200) {
        this.listEnd = res.data
        for (let i = 0; i < this.listEnd.length; i++) {
          let DataTime = this.listEnd[i].created_at
          let firstDataTime = DataTime.slice(0, 10)
          let lastDataTime = DataTime.slice(11, 19)
          DataTime = firstDataTime + ' ' + lastDataTime

          this.listEnd[i].DataTime = DataTime
          this.listEnd[i].openid = this.openid
        }
      }
    })
  },
  methods: {
    toText (text) {
      if (text) { return text.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ') }
    },
    toImg (text) {
      text = text.slice(text.indexOf('src="') + 5)
      text = text.slice(0, text.indexOf('"'))
      return text
    }
  }
}
</script>

<style lang="scss"  scoped>
.tabnar-header {
  text-align: center;
  position: relative;
  font-size: 18px;
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
      font-size: 13px;
    }
  }
}
.vote_img {
  width: 100%;
  height: 120px;
}
.vote_main {
  border-radius: 8px;
  background: #fff;
  height: 520px;
  position: absolute;
  width: 100%;
  top: 114px;
  padding-top: 24px;

  /deep/ .van-tabs__nav--card {
    border: none;

    .van-tab.van-tab--active {
      border-radius: 20px;
    }
    .van-tab__text {
      display: inline-block;
      font-size: 16px;
    }
    .van-tab {
      border: none;
      line-height: 30px;
      color: black;
    }
    .van-tab.van-tab--active {
      color: white;
      font-size: 1rem;
      background: #2196f3;
    }
  }
  .vote_main_center {
    margin: 24px 20px 0px;
    display: flex;
    justify-content: space-between;

    .vote_main_left {
      width: 66%;
      h2 {
        text-align: left;
        font-size: 18px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 2;
      }
      h3 {
        margin-top: 8px;
        text-align: left;
        color: #95a4b3;
        font-weight: 400;
        font-size: 16px;
        line-height: 18px;
        letter-spacing: 1.5px;
        word-break: break-word;
        //省略号
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 1;
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
          font-size: 14px;
        }
        .underway {
          color: #2196f3;
          font-size: 14px;
          background: #e8f4fd;
        }

        .end {
          color: #fd615c;
          font-size: 14px;
          background: #ffedec;
        }
      }
    }
  }
  .vote_a {
    display: inherit;
    width: 100%;
    color: black;
  }
  .vote_main_right_img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }
}
</style>
