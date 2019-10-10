//获取应用实例
const app = getApp()
Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        tagList: null,
        tagIndex: 0,  //选项卡索引
        reach: [1, 1, 1],
        isIndexBtnShow: false,

        langData: null,
        lang: ''
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        if (options.from == 'ma_msg') {
            this.setData({ isIndexBtnShow: true });
        }
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'repair', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                tagList: [
                    { name: res.tagName1[lang], type: 1, isShow: true },
                    { name: res.tagName2[lang], type: 2, isShow: false },
                    { name: res.tagName3[lang], type: 3, isShow: false }
                ]
            })
        });
    },

    onShow() {
        //当报修详情页有操作过，返回列表刷新
        if (app.globalData.repairReach) {
            this.setData({
                reach: [Math.random() + 1, Math.random() + 1, Math.random() + 1]
            });
            app.globalData.repairReach = false;
        }
    },


    //选项卡切换
    tagChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            ['tagList['+ index +'].isShow'] : true,
            tagIndex: index
        });
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function (e) {
        //动态赋予一个随机数触发组件上拉加载下一页函数
        var reachData = 'reach[' + this.data.tagIndex + ']';
        this.setData({
            [reachData]: Math.random()
        });
    },
})