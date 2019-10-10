const commonFn = require('../../../utils/common.js');
const app = getApp(); //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        tagList: null,
        tagIndex: 0,

        reach: [1, 1],

        // nowMonth:"",
        // dateMonth:"",

        langData: null,  //语言数据
        lang: '',    //语言类型

    },

    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'fee', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                tagList: [
                    { name: res.tagName1[lang], type: 1 },
                    { name: res.tagName2[lang], type: 2 }
                ]
            })
        });

        // var date = new Date;
        // date = date.getTime();
        // var month = commonFn.getDate(date).substring(0, 7); //本月
        // this.setData({ 
        //   nowMonth: month,
        //   dateMonth: month,
        // });

    },
    //选项卡切换
    tagChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            tagIndex: index
        });
    },

    //切换月份
    changeMonthFn(e) {
        this.setData({ dateMonth: e.detail.value });
        //this.getFeeList(1, 2, true);  //已抄表
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        var obj = 'reach[' + this.data.tagIndex + ']';
        this.setData({
            [obj]: Math.random()
        })
    }
})