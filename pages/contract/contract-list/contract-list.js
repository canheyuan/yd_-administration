
const app = getApp(); //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        tagList: null,
        tagIndex: 0,
        reachData: [1, 1],

        langData: null,
        lang: ''
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'contract', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.listTitle[lang] });  //设置当前页面的title
            this.setData({
                tagList: [
                    { name: res.tagText1[lang], type: 1, isShow: true },
                    { name: res.tagText2[lang], type: 2, isShow: false }
                ],
            })
        });
    },
    
    //选项卡切换
    tagChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        var setObj = 'tagList[' + index + '].isShow';
        this.setData({
            tagIndex: index,
            [setObj]: true
        });
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        var obj = 'reachData[' + this.data.tagIndex + ']';
        this.setData({
            [obj]: Math.random()
        })
    }
})