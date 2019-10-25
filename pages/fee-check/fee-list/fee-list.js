const commonFn = require('../../../utils/common.js');
const app = getApp(); //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        nowMonth:'',
        tagList: null,
        tagIndex: 0,

        langData: null,  //语言数据
        lang: '',    //语言类型

    },

    onLoad: function (options) {

        var date = new Date;
        date = date.getTime();
        var month = commonFn.getDate(date).substring(0, 7); //本月
        this.setData({ nowMonth: month });

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'fee', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                tagList: [
                    { name: res.tagName1[lang], type: 3, show: true, dateMonth: '', reach:1 },
                    { name: res.tagName2[lang], type: 1, show: false, dateMonth: '', reach: 1 },
                    { name: res.tagName3[lang], type: 2, show: false, dateMonth: '', reach: 1 }
                ]
            })
        })
    },
    
    //选项卡切换
    tagChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            ['tagList['+ index +'].show']:true,
            tagIndex: index 
        });
    },

    //切换月份
    // changeMonthFn(e) {
    //     this.setData({ dateMonth: e.detail.value });
    // },

    //切换月份
    changeMonthFn(e) {
        var dateMonthObj = 'tagList[' + this.data.tagIndex + '].dateMonth';
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({
            [dateMonthObj]: e.detail.value,
            [reachObj]: Math.random() + 1
        });
    },

    //下拉刷新
    onPullDownRefresh: function (e) {
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({  [reachObj]: Math.random() + 1 });
        wx.stopPullDownRefresh();
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({ [reachObj]: Math.random() })
    }
})