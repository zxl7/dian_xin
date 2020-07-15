<template>
  <div>
    <div class="banner">
      <div class="banner_title">
        <h1 class="banner_title_h1">活动征集</h1>
        <p class="banner_title_p">Activity solicitation</p>
      </div>
      <img alt class="vote_img" src="@/assets/img/image_活动征集.png" />
    </div>
    <div class="vote_main">
      <div :key="item.id" v-for="item in list">
        <router-link :to="{ name:'pages', query: {pageId:item.id}}" class="active_a">
          <div class="vote_main_center">
            <aside class="vote_main_right">
              <img :src="item.cover" class="vote_main_right_img" />
            </aside>
            <aside class="vote_main_left">
              <h2>{{item.title}}</h2>
              <h3>{{ToText(item.html_body)}}</h3>
              <p>
                <span>{{item.DataTime}}</span>
              </p>
            </aside>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
export default {
  data () {
    return {
      list: []
    }
  },
  mounted () {
    api.getActivityAPI().then(res => {
      if (res.status === 200) {
        this.list = res.data
        for (let i = 0; i < this.list.length; i++) {
          let DataTime = this.list[i].created_at
          let firstDataTime = DataTime.slice(0, 10)
          let lastDataTime = DataTime.slice(11, 19)
          DataTime = firstDataTime + ' ' + lastDataTime

          this.list[i].DataTime = DataTime
        }
      }
    })
  },
  methods: {
    ToText (HTML) {
      var input = HTML
      return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ')
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
      font-size: 14px;
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

  .vote_main_center {
    margin: 24px 20px 0px;
    display: flex;
    justify-content: space-between;

    .vote_main_left {
      width: 66%;
      margin-left: 20px;
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
          font-size: 14px;
          background: #f4f4f8;
        }
        .underway {
          color: #2196f3;
          background: #e8f4fd;
        }

        .end {
          color: #fd615c;
          background: #ffedec;
        }
      }
    }
  }

  .vote_main_right_img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }
  .active_a {
    display: inherit;
    width: 100%;
    color: #000;
  }
}
</style>
