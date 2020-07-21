<template>
  <view>
    <!-- 专辑背景 开始-->
    <view class="album_bg">
      <image :src="albumData.cover" mode="widthFix" />
      <view class="album_info">
        <view class="album_info_msg">{{albumData.name}}</view>
        <view class="album_info_btn">关注专辑</view>
      </view>
    </view>
    <!-- 专辑背景 结束-->

    <!-- 专辑作者 开始 -->
    <view class="album_author">
      <view class="album_author_info">
        <image :src="albumData.user.avatar" mode="widthFix" />
        <view class="author_name">{{albumData.user.name}}</view>
      </view>
      <view class="album_desc">
        <text>{{albumData.desc}}</text>
      </view>
    </view>
    <!-- 专辑作者 结束 -->

    <!-- 专辑列表 开始 -->
    <view class="album_list">
      <view class="album_item" v-for="item in wallpaperList" :key="item.id">
        <image :src="item.thumb" mode="aspectFill" />
      </view>
    </view>
    <!-- 专辑列表 结束 -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      params: {
        limit: 30, //	获取多少条数据
        order: "new", //关键字 “new”
        skip: 0, //	跳过多少条
        // 1 返回值中 有 album对象 表示第一次请求数据
        // 0 返回值中 只有 wallpaper 数组  不是第一次请求数据
        first: 1
      },
      id: -1, //专辑详情的id
      albumData: {}, //专辑数据信息
      wallpaperList: [] //背景墙纸数据列表
    };
  },
  onLoad(options) {
    const { id } = options;
    this.id = id;
    this.getDatas();
  },
  methods: {
    /**
     * 获取数据
     */
    async getDatas() {
      const resp = await this.$request({
        url: `http://157.122.54.189:9088/image/v1/wallpaper/album/${this.id}/wallpaper`,
        data: this.params
      });
      this.albumData = resp.res.album;
      this.wallpaperList = resp.res.wallpaper;
      this.wallpaperList = this.wallpaperList.map(item => {
        return {
          ...item,
          thumb: `${item.thumb}${item.rule.replace("$<Height>", 360)}`
        };
      });
      console.log(resp, "获取的数据");
    }
  }
};
</script>

<style lang='scss' scoped>
// 专辑背景
.album_bg {
  position: relative;
  .album_info {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    height: 80rpx;
    align-items: center;
    color: #fff;
    padding: 0 15rpx;
    &_msg {
      font-size: 40rpx;
    }
    &_btn {
      background-color: $color;
      width: 152rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10rpx;
    }
  }
}
// 专辑作者
.album_author {
  padding: 10rpx 10rpx;
  &_info {
    padding: 10rpx 0;
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    image {
      width: 50rpx;
    }
    .author_name {
      color: #000;
      margin-left: 15rpx;
    }
  }
  .album_desc {
    width: 100%;
    padding: 10rpx 10rpx;
  }
}
// 专辑列表
.album_list {
  display: flex;
  flex-wrap: wrap;
  .album_item {
    width: 33.33%;
    border: 3px solid #fff;
    image {
      height: 160rpx;
    }
  }
}
</style>