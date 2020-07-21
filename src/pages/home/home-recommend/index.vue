<template>
  <scroll-view
    class="scroll_view"
    scroll-y
    v-if="recommendList.length > 0"
    @scrolltolower="handleLower"
  >
    <!-- 推荐开始 -->
    <view class="recommend_wrap">
      <view class="recommend_item" v-for="item in recommendList" :key="item.id">
        <image mode="widthFix" :src="item.thumb" />
      </view>
    </view>
    <!-- 推荐结束 -->

    <!-- 月份开始 -->
    <view class="month_wrap">
      <!-- 上部分标题 -->
      <view class="month_title">
        <view class="month_title_left">
          <view class="left_info">
            <text class="big">{{monthData.DD}}</text>
            /{{monthData.MM}}月
          </view>
          <view class="right_info">{{monthData.title}}</view>
        </view>
        <view class="month_title_right">更多 ></view>
      </view>
      <!-- 下部分主要内容 -->
      <view class="month_content">
        <view class="month_item" v-for="item in monthData.items" :key="item.id">
          <image mode="aspectFill" :src="item.thumb" />
        </view>
      </view>
    </view>
    <!-- 月份结束 -->

    <!-- 热门开始 -->
    <view class="hot_wrap">
      <view class="hot_title">
        <text>热门</text>
      </view>
      <view class="hot_content">
        <view class="hot_item" v-for="item in hotList" :key="item.id">
          <image mode="widthFix" :src="item.thumb" />
        </view>
      </view>
    </view>
    <!-- 热门结束 -->
  </scroll-view>
</template>

<script>
import moment from "moment"; //处理时间的库
export default {
  mounted() {
    this.getDatas();
  },
  data() {
    return {
      recommendList: [], //推荐列表初始化数据
      monthData: {}, //月份模块数据
      hotList: [], //热门列表数据
      params: {
        //请求的参数
        limit: 30, //没一页的数量
        order: "hot", //关键字
        skip: 0 //翻页跳过的数量
      },
      hasMore: true //是否还有数据
    };
  },
  methods: {
    /**
     * 请求数据
     */
    async getDatas() {
      try {
        const resp = await this.$request({
          url: "http://157.122.54.189:9088/image/v3/homepage/vertical",
          data: this.params
        });
        //   判断请求回来的热门数据长度是否为0 来确定是否还有数据
        if (resp.res.vertical.length <= 0) {
          this.hasMore = false;
          uni.showToast({
            title: "没有更多数据了~",
            mask: true,
            duration: 1000,
            icon: "none"
          });
          return;
        }
        //   如果是第一次请求的话才赋值下面的数据 不然下拉触底的话这些数据是不会改变的
        if (this.recommendList.length === 0) {
          this.recommendList = resp.res.homepage[1].items; //赋值推荐列表数据
          this.monthData = resp.res.homepage[2]; //赋值月份数据
          this.monthData.MM = moment(this.monthData.stime).format("MM"); //根据时间戳给数据添加一个MM属性的月份
          this.monthData.DD = moment(this.monthData.stime).format("DD"); //根据时间戳给数据添加一个DD属性的日期
          this.monthData.items = this.monthData.items.map(item => {
            //将图片地址拼接上高度处理后返回
            return {
              ...item,
              thumb: `${item.thumb}${item.rule.replace("$<Height>", 360)}`
            };
          });
        }
        this.hotList = [...this.hotList, ...resp.res.vertical]; //赋值热门数据列表 触底数据叠加
      } catch (error) {
        uni.showToast({
          title: error.errMsg,
          mask: true,
          duration: 1000,
          icon: "none"
        });
      }
    },

    /**
     * 触底事件
     */
    handleLower() {
      /**
       * 1.改变请求参数skip的值
       * 2.再次发送请求
       * 3.请求的数据拼接
       */
      //   每次触底之前判断是否还有数据
      if (!this.hasMore) {
        uni.showToast({
          title: "没有更多数据了~",
          icon: "none",
          mask: true,
          duration: 1000
        });
        return;
      }
      this.params.skip += this.params.limit; //跳过的数据叠加
      this.getDatas(); //请求数据
    }
  }
};
</script>

<style lang='scss' scoped>
.scroll_view {
  height: calc(100vh - 46px);
  // 推荐开始
  .recommend_wrap {
    display: flex;
    flex-wrap: wrap;
    .recommend_item {
      width: 50%;
      border: 3px solid #ddd;
    }
  }
  // 月份开始
  .month_wrap {
    margin-top: 10rpx;
    .month_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &_left {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .left_info {
          color: $color;
          margin-left: 15rpx;
          .big {
            font-size: 38rpx;
          }
        }
        .right_info {
          color: #222;
          font-size: 32rpx;
          font-weight: bold;
          margin-left: 50rpx;
        }
      }
      &_right {
        margin-right: 15rpx;
      }
    }
    .month_content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10rpx;
      .month_item {
        width: 33.33%;
        border: 1rpx solid #fff;
      }
    }
  }
  // 热门开始
  .hot_wrap {
    margin-top: 10rpx;
    .hot_title {
      padding: 20rpx;
      text {
        border-left: 20rpx solid $color;
        padding-left: 20rpx;
        font-size: 34rpx;
        font-weight: 600;
      }
    }
    .hot_content {
      display: flex;
      flex-wrap: wrap;
      .hot_item {
        width: 33.33%;
        border: 2rpx solid #fff;
      }
    }
  }
}
</style>