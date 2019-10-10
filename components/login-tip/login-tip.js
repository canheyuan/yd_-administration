
const app = getApp();   //获取应用实例
Component({
    //组件的属性列表
    properties: {
        closeBtnShow: Boolean,
    },

    data: {
        domainUrl:app.globalData.domainUrl,
        closeBtnShow: false,
        langData:null
    },
    //组件加载完成后
    attached() {
        //加载语言文件包
        app.loadLangFn(this, 'cpLoginTip');
        //判断是否有关闭按钮
        this.setData({
            closeBtnShow: this.properties.closeBtnShow ? this.properties.closeBtnShow : false
        })
    },

    //组件的方法列表
    methods: {
        
        closePopFn() {  //关闭弹窗
            this.triggerEvent('closePop');
        },

        getUserInfoFn(e) {  //获取用户信息并跳转至登录页
            wx.removeStorageSync('userInfo'); //清除之前缓存
            wx.redirectTo({ url: '/pages/common/login/login' })
        },
    }
})
