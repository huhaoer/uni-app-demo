<template>
  <scroll-view scroll-y class="album_scroll" @scrolltolower="handleToLower">
    <!-- 轮播图开始 -->
    <view class="album_swiper">
      <swiper indicator-dots autoplay circular easing-function="easeInOutCubic">
        <swiper-item v-for="item in swiperList" :key="item.id">
          <image :src="item.thumb" />
        </swiper-item>
      </swiper>
    </view>
    <!-- 轮播图结束 -->

    <!-- 专辑列表开始 -->
    <view class="album_list">
      <navigator
        class="album_item"
        v-for="item in albumList"
        :key="item.id"
        :url="`/pages/album/index?id=${item.id}`"
      >
        <view class="album_img">
          <image mode="aspectFill" :src="item.cover" />
        </view>
        <view class="album_info">
          <view class="album_name">{{item.name}}</view>
          <view class="album_desc">{{item.desc}}</view>
          <view class="album_btn">
            <view class="album_attention">关注</view>
          </view>
        </view>
      </navigator>
    </view>
    <!-- 专辑列表结束 -->
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      swiperList: [], //轮播图列表
      albumList: [], //专辑列表
      params: {
        limit: 30, //获取多少条数据
        order: "new", //关键字 “new”
        skip: 0
      },
      hasMore: true //是否还有数据加载
    };
  },
  mounted() {
    this.setTitle();
    this.getDatas();
  },
  methods: {
    /**
     * 动态设置导航栏标题
     */
    setTitle() {
      uni.setNavigationBarTitle({
        title: "专辑"
      });
    },

    /**
     * 数据请求
     */
    async getDatas() {
      try {
        const resp = await this.$request({
          url: "http://157.122.54.189:9088/image/v1/wallpaper/album",
          data: this.params
        });
        // 根据返回的album数据判断是否还有数据
        if (resp.res.album.length === 0) {
          this.hasMore = false;
          uni.showToast({
            title: "没有更多数据了~",
            mask: true,
            duration: 1000,
            icon: "none"
          });
          return;
        }
        // 第一次加载时才获取轮播图数据,否则就只是下拉请求专辑列表数据
        if (this.swiperList.length === 0) {
          this.swiperList = resp.res.banner; //轮播图列表赋值 640 * 284
        }
        this.albumList = [...this.albumList, ...resp.res.album]; //专辑列表赋值 数据叠加
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
    handleToLower() {
      if (!this.hasMore) {
        uni.showToast({
          title: "没有更多数据了~",
          mask: true,
          duration: 1000,
          icon: "none"
        });
        return;
      }
      // 1.改变当前请求参数
      // 2.重新发送请求
      // 3.让数据叠加
      this.params.skip += this.params.limit;
      this.getDatas();
    }
  }
};
</script>

<style lang='scss' scoped>
.album_scroll {
  height: calc(100vh - 46px);
  // 轮播图
  .album_swiper {
    swiper {
      // swiper固定高度为150 为了自适应，需要修改他的高度
      /**
        750rpx / ? = 640 / 284 根据图片的宽高比计算出swiper的高度
    */
      height: calc(750rpx / 2.3);
      image {
        height: 100%;
      }
    }
  }
  // 专辑列表
  .album_list {
    padding: 10rpx;
    .album_item {
      padding: 10rpx 0;
      display: flex;
      border-bottom: 1rpx solid #ccc;
      .album_img {
        flex: 1;
        padding: 10rpx;
        image {
          width: 200rpx;
          height: 200rpx;
        }
      }

      .album_info {
        flex: 2;
        padding: 0 10rpx;
        overflow: hidden;
        .album_name {
          font-size: 30rpx;
          color: #000;
          padding: 10rpx 0;
        }

        .album_desc {
          padding: 10rpx 0;
          font-size: 24rpx;

          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .album_btn {
          padding: 10rpx;
          display: flex;
          justify-content: flex-end;
          .album_attention {
            color: $color;
            border: 1rpx solid $color;
            padding: 10rpx;
          }
        }
      }
    }
  }
}
</style>