
const app = getApp();   //获取应用实例
const datas = require('data.js');   //获取页面内容
const pageInfo = datas.page_data;

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        pageData: {},
        langData: null,
        lang: ''
    },

    /** 生命周期函数--监听页面加载*/
    onLoad: function (options) {

        var pageData = options.page ? pageInfo[options.page] : pageInfo['nothing'];
        if (options.page == 'activity') {
            pageData.details_btn_url = pageData.details_btn_url + '?id=' + options.id;
        }
        this.setData({
            pageData: pageData
        })
        wx.setNavigationBarTitle({
            title: pageData.page_title
        })
    }
})