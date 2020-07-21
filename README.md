# 安装scss
yarn add sass-loader node-sass

# 安装uni-ui
yarn add @dcloudio/uni-ui

```js
// 使用组件
<uni-badge text="2" type="success" @click="bindClick"></uni-badge>

import {uniBadge} from '@dcloudio/uni-ui'
export default {
    components: {uniBadge}
}
```

# 安装moment
yarn add moment 处理时间的库