
const app = getApp(); //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        loginInfo: null, //登录信息
        topParkName:'', //顶部园区名称
        indexData: null, //首页信息
        
        noticeData:null, //通知公告数据
        hasUserInfo: true,  //是否弹出登录提示
        menuData: null,   //菜单栏
        backTopShow: false, //返回顶部是否显示

        backlogReach:null, //待办事项刷新
        tabMsgNum: 0,   //自定义底部菜单栏消息数

        langData: null, //
        lang: ''
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        
    },

    //加载菜单
    menuLoad() {
        var lang = this.data.lang;
        app.getMenuFn((res) => {
            var menuData = res;
            menuData.forEach(item => {
                item.title = lang == 'en' ? item.nameEn : item.name
            });
            this.setData({ menuData: menuData });
        })
    },

    //下拉刷新
    onPullDownRefresh: function (e) {
        
        console.log("下拉刷新",e);
        this.reach();
        wx.stopPullDownRefresh();
    },

    onShow() {
        app.chatData.pageThis = this;
        app.chatData.chatPage = 'index';

        //是否刷新
        if (app.globalData.indexReach) {
            app.globalData.indexReach = false;
            if (app.globalData.sessionId) {
                this.reach();
            }else{
                //隐藏提示登录弹窗
                var timer = setInterval(() => {
                    if (app.globalData.sessionId) {
                        clearInterval(timer);
                        this.reach();
                    }
                }, 300);
            }
        } else {
            if (app.globalData.isLogin) {
                this.getIndexData();    //首页信息
            }
        }
    },

    //加载
    reach() {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'index', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.indexTitle[lang] });  //设置当前页面的title
        });

        //获取园区名称
        var parkName = this.data.langData.public.dfParkName[this.data.lang];  //顶部园区名称
        var loginInfo = app.globalData.userInfo;
        if (loginInfo) {
            if (loginInfo.curParkName) {
                parkName = loginInfo.curParkName;
            } else if (loginInfo.userInfo && loginInfo.userInfo.parkInfo && loginInfo.userInfo.parkInfo.parkName) {
                parkName = loginInfo.userInfo.parkInfo.parkName;
            }
        }

        if (!app.globalData.isLogin) {
            this.setData({ 
                hasUserInfo: false,
                topParkName: parkName
            }); //弹出提示登录弹窗
            wx.hideTabBar();  //未登录隐藏tab栏
        } else {
            if(this.data.lang == 'zh'){
                wx.showTabBar();  //登录显示tab栏
            }
            this.setData({
                loginInfo: app.globalData.userInfo,
                topParkName: parkName,
                hasUserInfo: true,
                backlogReach: Math.random() + 1 //刷新待办事项
            });
            this.menuLoad();        //菜单栏
            this.getNoticeData();   //通知公告列表
            this.getIndexData();    //首页数据
        }
    },

    onHide: function () {
        app.chatData.pageThis = null;
        app.chatData.chatPage = '';
    },

    //获取通知公告列表数据
    getNoticeData() {
        var _this = this;
        app.requestFn({
            url: `/manage/noticeInfoIndex`,
            success: (res) => {
                console.log("通知公告：", res.data);
                var datas = res.data.data;
                _this.setData({ noticeData: datas });
            }
        });
    },

    //打开扫码界面
    scanCodeFn() {
        wx.scanCode({
            onlyFromCamera: false,
            success(res) {
                console.log('扫码后返回的参数：', res);
                var code = res.result;

                wx.request({
                    url: app.globalData.jkUrl + `/manage/userCoupon/detail/${code}`,
                    method: 'GET',
                    header: {
                        "5ipark-sid": app.globalData.sessionId,
                        '5ipark-channel': app.globalData.appApi.channel,
                        "5ipark-aid": app.globalData.appApi.aid
                    },
                    success: (res) => {
                        var dCode = res.data.code;
                        var goUrl = '';
                        switch (dCode) {
                            case 0:
                                goUrl = `/pages/coupon/coupon-detail/coupon-detail?id=${code}`;
                                break;
                            case 403:
                                goUrl = `/pages/coupon/scan-error/scan-error?page=coupon403`;
                                break;
                            default:
                                goUrl = `/pages/coupon/scan-error/scan-error?page=coupon404`;
                                break;
                        }
                        wx.navigateTo({ url: goUrl });
                    }
                })

            }
        });
    },

    //获取首页信息
    getIndexData() {
        var _this = this;
        app.getMessageNumFn((res)=>{
            var indexData = res.indexData;
            indexData['msgNum'] = res.sumNum;
            _this.setData({ 
                indexData: indexData,
                tabMsgNum: res.sumNum
            });
        })
    },

    //上拉加载更多
    onReachBottom: function () {
        this.setData({ backlogReach: Math.random()})
    },

    //监听滚动判断是否显示返回顶部按钮
    onPageScroll(e) {
        if (e.scrollTop > 300) {
            this.setData({ backTopShow: true });
        } else {
            this.setData({ backTopShow: false });
        }
    },

    //返回顶部按钮
    backTopFn() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    },

    //滚动到待办事项
    scrollToDoFn(e) {
        wx.createSelectorQuery().select('#todo_mdl').fields({
            rect: true
        }, function (res) {
            wx.pageScrollTo({ scrollTop: res.top });
        }).exec()
    }
})