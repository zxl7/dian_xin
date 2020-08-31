<template>
  <div>
    <div class="page">
      <header class="page-header">
        <div class="page-title">{{dataObj.title}}</div>
        <div class="page-created_at">
          <span>{{dataObj.dateTime}}</span>
          <span v-if="status === '进行中'" class="green">{{status}}</span>
          <span v-else-if="status === '已结束'" class="end">{{status}}</span>
        </div>
      </header>
      <div class="page-content">
        <img :src="dataObj.imgSrc" alt="">
        <p>{{dataObj.desc}}</p>
        <div v-if="status === '进行中'" class="blue" @click="joinActivity()">一建报名</div>
        <div v-else-if="status === '已结束'" class="grey" @click="end()">一建报名</div>
      </div>
      <van-popup
        :style="{ height: '200px',width:'70%' }"
        round
        close-icon="none"
        closeable
        v-model="show"
      >
        <div class="popup">
          <h1 class="popup_h1">提示</h1>
          <p class="popup_title">需要实名认证才能继续，是否前往登录？</p>
          <div class="popup_botton">
            <div class="noLogin" @click="show=false">取消</div>
            <a class="goLogin" href="http://wsq.gxzzzx.cn/mobile/wsq/login">确定</a>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  name: "apply",
  data() {
    return {
      pageId: 0,
      activityId: '',
      status: '',
      dataObj: "",
      userId: "",
      list: [],
      showComments: true,
      commentNum: 0,
      show: false,
      userInfo: ''
    };
  },
  async mounted() {
    this.pageId = parseInt(this.$route.query.tableId);
    this.activityId = this.$route.query.type
    this.openid = this.$route.query.openid;
    this.mobile = this.$route.query.mobile;
    this.status = this.$route.query.status
    this.url = "/api/v4/forms/" + this.pageId + "/responses";
    let keyword = "";
    if (this.$route.query.mobile) {
      keyword = this.$route.query.mobile;
    }
    await api.getUserAPI(keyword).then((res) => {
      this.userInfo = res.data[0]
    });
    await api.getTagActivity(this.activityId).then((res) => {
      res.data.forEach((ele) => {
        if (ele.id === this.pageId) {
          this.dataObj = ele;
          this.dataObj.dateTime = this.dateFormat("YYYY-mm-dd", this.dataObj.created_at)
          this.dataObj.imgSrc = this.toImg(this.dataObj.description)
          this.dataObj.desc = this.toText(this.dataObj.description)
          document.title = this.dataObj.title;
          window.desc = this.dataObj.title;
        }
      });
    });
  },
  methods: {
    end() {
      this.$toast('活动已结束')
    },
    async joinActivity() {
      let data = ''
      let canResponses = true
      await api.getFormData(this.pageId).then(res => {
        data = {
          "response": {
            "entries_attributes": [
              {
                "field_id": res.data.fields[0].id,
                "value": this.userInfo.name
              },
              {
                "field_id": res.data.fields[1].id,
                "value": this.userInfo.phone
              }
            ]
          },
          "user_id": this.userInfo.id
        }
      })
      await api.getVotingAPI(this.url).then((res) => {
        res.data.forEach(item => {
          if (this.userInfo.name === item.user.name) {
            canResponses = false
          }
        })
      })
      if (canResponses) {
        await api.postFormData(this.pageId, data).then(res => {
          console.log(res)
          this.$toast.success('报名成功');
        })
      } else {
        this.$toast({
          message: '请勿重复报名',
          icon: 'warning-o',
        });
      }
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
    link() {
      if (this.$route.query.mobile) {
        this.$router.push({
          name: "comments",
          query: { pageId: this.pageId, userId: this.userId },
        });
      } else {
        this.show = !this.show;
      }
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
  },
}
</script>

<style  lang="scss" scoped>
.page {
  flex-grow: 1;
  padding: 0 15px;
  background-color: white;
}
.page-header {
  text-align: left;
  font-size: 18px;
  border-bottom: 1px solid #e9e9e9;

  .page-title {
    font-size: 20px;
    color: #615f6c;
    font-weight: bold;
  }

  .page-created_at {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    display: flex;
    justify-content: space-between;
    span:first-child{
      font-size: 14px;
      line-height: 16px;
      color: #6B7885;
    }
    span:last-child{
      border-radius: 12px;
      font-size: 13px;
      line-height: 20px;
      padding: 0 8px;
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
.page-header > * {
  margin: 15px 0;
}

.page-content {
  padding-top: 24px;
  font-family: PingFang SC;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  img{
    width: 345px;
    height: 160px;
    object-fit: cover;
    background: #FFFFFF;
    border-radius: 8px;
  }
  p{
    margin: 16px 0 40px;
    line-height: 27px;
    text-align: justify;
    color: #313C56;
  }
  div{
    height: 40px;
    border-radius: 8px;
    line-height: 40px;
    text-align: center;
  }
  .blue{
    background: #2196F3;
    color: #FFFFFF;
  }
  .grey{
    background: #F4F4F8;
    color: rgba(49, 60, 86, 0.2);
  }
}
.popup {
  padding: 20px;
}
.popup_h1 {
  margin-top: 20px;
  font-size: 16px;
  text-align: left;
}
.popup_title {
  margin-top: 5%;
  display: flex;
  font-size: 14px;
}
.popup_botton {
  margin-top: 10%;
  display: flex;
  justify-content: flex-end;
  margin-right: 10%;
  .noLogin {
    font-size: 14px;
    margin-right: 10%;
  }
  .goLogin {
    text-align: center;
    font-size: 14px;
    color: #223469;
  }
}
</style>
