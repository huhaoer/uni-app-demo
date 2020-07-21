<template>
  <view class="home_tab">
    <!-- 头部tab选项 -->
    <view class="home_tab_title">
      <view class="title_inner">
        <uni-segmented-control
          :values="items.map(v=>v.title)"
          :current="current"
          @clickItem="onClickItem"
          style-type="text"
          active-color="#d4237a"
        ></uni-segmented-control>
      </view>
      <view class="iconfont iconsearch"></view>
    </view>

    <!-- 下面主要内容区域 -->
    <view class="home_tab_content">
      <view v-if="current === 0">
        <home-recommend></home-recommend>
      </view>
      <view v-if="current === 1">
        <home-category></home-category>
      </view>
      <view v-if="current === 2">
        <home-new></home-new>
      </view>
      <view v-if="current === 3">
        <home-album></home-album>
      </view>
    </view>
  </view>
</template>

<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui"; //从uni-ui引入分段器组件
import homeRecommend from "./home-recommend"; //推荐
import homeCategory from "./home-category"; //分类
import homeNew from "./home-new"; //最新
import homeAlbum from "./home-album"; //专辑
export default {
  components: {
    uniSegmentedControl,
    homeRecommend,
    homeCategory,
    homeNew,
    homeAlbum
  },
  data() {
    return {
      items: [
        { title: "推荐" },
        { title: "分类" },
        { title: "最新" },
        { title: "专辑" }
      ],
      current: 3
    };
  },
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.home_tab {
  &_title {
    position: relative;
    .title_inner {
      width: 60%;
      margin: 0 auto;
    }
    .iconsearch {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5%;
    }
  }
  &_content {
      margin-top: 20rpx;
  }
}
</style>