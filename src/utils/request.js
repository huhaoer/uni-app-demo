/**
 * 导出封装的request请求函数
 */
export default (props) => {
    return new Promise((resolve, reject) => {
        // 设置加载中动画
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            // url: 'test.php', //仅为示例，并非真实的接口地址
            // data: {
            //     x: '',
            //     y: ''
            // },
            // header: {
            //     'content-type': 'application/json' // 默认值
            // },
            ...props,//其余属性通过props传递过来
            success(resp) {
                resolve(resp.data)
            },
            fail(err) {
                reject({errMsg: '网络错误'})
            },
            complete() {
                uni.hideLoading()
            }
        })
    })
}