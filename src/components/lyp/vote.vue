<template>
  <div>
    <div>
      <div class="header">
        <div class="title">社区活动</div>
        <div class="titleEnglish">Community Activity</div>
        <img class="headerImg" src="@/assets/img/amicoVote.svg" />
      </div>
      <div class="headerBorderRadius"></div>
    </div>
    <div class="vote_main">
      <van-tabs type="card" v-model="active">
        <van-tab title="全部">
          <div :key="item.id" v-for="(item,index) in  allActivity">
            <router-link :to="{name:item.name,query:{status:item.status, tableId:item.id, userIndex:index,openid:item.openid,mobile:item.mobile,type:item.labelNum}}"
                          class="vote_a">
              <div class="vote_main_center">
                <aside class="vote_main_left">
                  <h2>{{item.title}}</h2>
                  <p>{{item.dataTime}}</p>
                  <div><span class="activityType">{{ item.activityType }}</span></div>
                </aside>
                <aside class="vote_main_right">
                  <img :src="item.imgSrc" class="vote_main_right_img" />
                </aside>
              </div>
            </router-link>
          </div>
        </van-tab>
        <van-tab title="投票">
          <div :key="item.id" v-for="(item,index) in vote">
            <router-link :to="{name:item.name,query:{status:item.status,tableId:item.id,userIndex:index,openid:item.openid,mobile:item.mobile,type:item.labelNum}}"
              class="vote_a">
              <div class="vote_main_center">
                <aside class="vote_main_left">
                  <h2>{{item.title}}</h2>
                  <p>{{item.dataTime}}</p>
                  <div>
                    <span class="activityType">{{item.activityType}}</span>
                    <span v-if="item.status === '进行中'" class="green">{{item.status}}</span>
                    <span v-else-if="item.status === '已结束'" class="end">{{item.status}}</span>
                  </div>
                </aside>
                <aside class="vote_main_right">
                  <img :src="item.imgSrc" class="vote_main_right_img" />
                </aside>
              </div>
            </router-link>
          </div>
        </van-tab>
        <van-tab title="评议">
          <div :key="item.id" v-for="(item) in appraise">
            <router-link :to="{name:item.name,query: {status:item.status,tableId:item.id,mobile:item.mobile,type:item.labelNum}}" class="vote_a">
              <div class="vote_main_center">
                <aside class="vote_main_left">
                  <h2>{{item.title}}</h2>
                  <p>{{item.dataTime}}</p>
                  <div>
                    <span class="activityType">{{item.activityType}}</span>
                    <span v-if="item.status === '进行中'" class="green">{{item.status}}</span>
                    <span v-else-if="item.status === '已结束'" class="end">{{item.status}}</span>
                  </div>
                </aside>
                <aside class="vote_main_right">
                  <img :src="item.imgSrc" class="vote_main_right_img" />
                </aside>
              </div>
            </router-link>
          </div>
        </van-tab>
        <van-tab title="活动">
          <div :key="item.id" v-for="(item,index) in activity">
            <router-link :to="{name:item.name,query:{status:item.status,tableId:item.id,userIndex:index,openid:item.openid,mobile:item.mobile,type:item.labelNum}}"
                         class="vote_a">
              <div class="vote_main_center">
                <aside class="vote_main_left">
                  <h2>{{item.title}}</h2>
                  <p>{{item.dataTime}}</p>
                  <div>
                    <span class="activityType">{{item.activityType}}</span>
                    <span v-if="item.status === '进行中'" class="green">{{item.status}}</span>
                    <span v-else-if="item.status === '已结束'" class="end">{{item.status}}</span>
                  </div>
                </aside>
                <aside class="vote_main_right">
                  <img :src="item.imgSrc" class="vote_main_right_img" />
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
import api from "@/api/api";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      immediate_check: false,
      loadNum: 1,
      active: 0,
      openid: "",
      mobile: "15883535414",
      county: "东升社区",
      tagId: '',
      activityId: '',
      allActivity: [],
      vote: [],
      appraise: [], // 评议
      activity: []
    };
  },
  async mounted() {
    if (this.$route.query.openid) {
      this.openid = this.$route.query.openid;
    }
    if (this.$route.query.mobile) {
      this.mobile = this.$route.query.mobile;
    }
    switch (this.county) {
      case "新城社区": this.tagId = 5; this.activityId = 8; break;
      case "石门社区": this.tagId = 4; this.activityId = 31; break;
      case "东升社区": this.tagId = 11; this.activityId = 660; break;
      case "庆山社区": this.tagId = 10; this.activityId = 26; break;
    }
    let allData = []
    // 社区
    await api.getTagActivity(this.tagId).then((res) => {
      allData = res.data
    })
    // 投票（进行中）
    await api.getTagActivity(2).then((res) => {
      this.vote = this.getData(res.data, allData, '进行中', '投票', 2)
    })
    // 投票（已结束）
    await api.getTagActivity(3).then((res) => {
      this.vote = this.vote.concat(this.getData(res.data, allData, '已结束', '投票', 3))
    })
    // 活动（进行中）
    await api.getTagActivity(6).then((res) => {
      this.activity = this.getData(res.data, allData, '进行中', '活动', 6)
    })
    // 活动（已结束）
    await api.getTagActivity(7).then((res) => {
      this.activity = this.activity.concat(this.getData(res.data, allData, '已结束', '活动', 7))
    })
    // 评议
    await api.getActivityAPILyp(this.activityId).then((res) => {
      res.data.forEach(item => {
        let obj = {};
        obj.dataTime = this.dateFormat("YYYY/mm/dd", item.created_at)
        obj.mobile = this.mobile;
        obj.title = item.title;
        obj.activityType = '评议';
        obj.status = item.description
        obj.id = item.id
        obj.desc = this.toText(item.html_body)
        obj.imgSrc = item.cover
        obj.name = 'pagesLyp'
        obj.labelNum = this.activityId
        this.appraise.push(obj)
      })
    });
    this.allActivity = this.vote.concat(this.activity)
    this.allActivity = this.allActivity.concat(this.appraise)
    // 时间排序
    this.vote = this.vote.sort((a, b) => b.dataTime < a.dataTime ? -1 : 1)
    this.appraise = this.appraise.sort((a, b) => b.dataTime < a.dataTime ? -1 : 1)
    this.activity = this.activity.sort((a, b) => b.dataTime < a.dataTime ? -1 : 1)
    this.allActivity = this.allActivity.sort((a, b) => b.dataTime < a.dataTime ? -1 : 1)
    document.title = "社区活动";
  },
  methods: {
    getData(arr, allData, status, activityType, labelNum) {
      let myData = []
      arr.forEach(voteItem => {
        allData.forEach(item => {
          if (voteItem.title === item.title) {
            let myVote = this.declareData(voteItem)
            myVote.status = status
            myVote.activityType = activityType
            myVote.mobile = this.mobile
            switch (activityType) {
              case "投票": myVote.name = 'votingLyp'; break;
              case "活动": myVote.name = 'applyLyp'; break;
            }
            myVote.labelNum = labelNum
            myData.push(myVote)
          }
        })
      })
      return myData
    },
    votePopup() {
      this.$toast('活动已结束！')
    },
    toText(text) {
      if (text) {
        return text
          .replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, "")
          .replace(/<[^>]+?>/g, "")
          .replace(/\s+/g, " ")
          .replace(/ /g, " ")
          .replace(/>/g, " ");
      }
    },
    toImg(text) {
      text = text.slice(text.indexOf('src="') + 5);
      text = text.slice(0, text.indexOf('"'));
      return text;
    },
    declareData(data) {
      let obj = {}
      obj.title = data.title
      obj.id = data.id
      obj.dataTime = this.dateFormat("YYYY/mm/dd", data.created_at)
      obj.desc = this.toText(data.description)
      obj.imgSrc = this.toImg(data.description)
      return obj
    },
    //  重构时间（时间格式，时间）
    dateFormat(fmt, date) {
      date = date ? new Date(date) : new Date();
      var ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (var k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
      };
      return fmt;
    },
  },
};
</script>

<style lang="scss" scoped>
.header{
  /*position: relative;*/
  position: absolute;
  width: 100%;
  height: 120px;
  overflow: hidden;
  left: calc(50% - 100%/2);
  top: 0;
  background: linear-gradient(88.34deg, #B1391A 0%, #EC3017 100%);
}
.title{
  position: absolute;
  z-index: 999;
  left: calc(50% - 60px/2 - 117.5px);
  top: 42px;
  font-family: PingFang SC;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
  color: #FFFFFF;
}
.titleEnglish{
  position: absolute;
  z-index: 999;
  left: calc(50% - 61px/2 - 117px);
  top: 66px;
  font-family: PingFang SC;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 13px;
  color: rgba(255, 255, 255, 0.4);
}
.headerImg {
  position: absolute;
  left: 54.67%;
  right: 2.67%;
  top: 10%;
  bottom: -32.86%;
}
.headerBorderRadius{
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  width: 100%;
  position: absolute;
  top: 107px;
  background-color: white;
  padding: 7.5px 0;
}
.vote_main {
  padding-top: 121px;
  /deep/ .van-tabs--card>.van-tabs__wrap{
    height: 32px;
  }
  /deep/ .van-tabs__nav--card {
    border: none;

    .van-tab.van-tab--active {
      height: 32px;
      border-radius: 20px;
      color: white;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      text-align: center;
      background: #2196F3;
    }
    .van-tab__text {
      display: inline-block;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      text-align: center;
    }
    .van-tab {
      height: 32px;
      border: none;
      line-height: 32px;
      color: #95A4B3;
    }
  }
  .vote_main_center {
    margin: 12px 15px 0;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    background: #FFFFFF;
    border: 1px solid #F0EFF4;
    box-sizing: border-box;
    border-radius: 8px;
    .vote_main_left {
      width: 57%;
      h2 {
        height: 48px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        color: #313C56;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 2;
      }
      p {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 20px;
        color: #95A4B3;
        margin: 4px 0 8px;
      }
      div{
        display: flex;
        justify-content: space-between;
        .activityType {
          padding: 0 8px;
          background: #E9F5FE;
          border-radius: 4px;
          font-family: PingFang SC;
          font-style: normal;
          font-weight: normal;
          font-size: 13px;
          line-height: 20px;
          text-align: center;
          color: #2196F3;
          flex: none;
          order: 0;
          align-self: center;
        }
        span:last-child{
          padding: 0 8px;
          border-radius: 12px;
          font-family: PingFang SC;
          font-style: normal;
          font-weight: normal;
          font-size: 13px;
          line-height: 20px;
          text-align: center;
          flex: none;
          order: 0;
          align-self: center;
        }
        .green{
          background-color: #68C635;
          color: #FFFFFF;
        }
        .end{
          background-color: #F4F4F8;
          color: #95A4B3;
        }
      }
    }
    .vote_main_right{
      width: 39%;
      height: 100px;
      .vote_main_right_img {
        width: 100%;
        height: 100%;
        margin:0;
        object-fit: cover;
      }
    }
  }
  .vote_a {
    display: inherit;
    width: 100%;
    color: black;
  }

}
</style>
