const app = getApp();//获取应用实例
const commonFn = require('../../../utils/common.js');//一些通用的函数
const formTip = require('../../../utils/validateForm.js');   //验证

Page({
    data: {
        domainUrl: app.globalData.domainUrl, //图片域名前缀
        userInfo: null,  //用户信息

        langData: null,
        lang: ''
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'formPage', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.loginTitle[lang] });  //设置当前页面的title
        });

        //从缓存获取用户信息
        var loginInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : null; 
        if (loginInfo) {
            this.setData({ userInfo: loginInfo.userInfo });
        }
    },

    //点击立即登录按钮触发
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        var langData = this.data.langData;
        var lang = this.data.lang;

        //验证
        var isTip = formTip([
            { name: 'userName', verifyText: formData.username },
            { name: 'password', verifyText: formData.password },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        var openId = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').otherLoginId : '';   //清除之前缓存
        formData['openId'] = openId;

        app.requestFn({
            loadTitle: langData.public.loginTip[lang],
            isSessionId: false,
            url: `/manage/login`,
            header: 'application/x-www-form-urlencoded',
            data: formData,
            method: 'POST',
            success: (res) => {
                var loginInfo = res.data.data;
                wx.removeStorageSync('userInfo'); //清除之前缓存
                app.globalData.sessionId = loginInfo.sessionId; //存储登录后的sessionId,记录登录状态

                app.getWxLoginInfo(app, function (data) {
                    app.globalData.userInfo = loginInfo;
                    app.globalData.userIndexReach = true;
                    app.globalData.indexReach = true;
                    app.globalData.isLogin = true;  //登录状态
                    app.getImUserInfo();
                    wx.switchTab({ url: '/pages/index/index' });
                });

            }
        });
    }
})