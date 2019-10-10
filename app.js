
let appConfig = require('config.js');   //不同小程序的配置信息
let langJson = require('lang.js');   //加载语言文件包
var Config = require('utils/config.js').IM;
var webim = require('utils/webim_wx.js');
var chatIm = require('utils/chatIm.js');
App({

    globalData: {
        appVersion: '1.3.2',  //上传的版本号
        appVersionDate: '20191010',  //版本更新的日期
        apiMsgSwitch: false,  //控制接口提示信息开关,true:开，false:关
        isChatLogin: true,    //控制是否调用聊天登录,true:开启，false:关闭
        menuData:null,  //自定义首页菜单
        
        langData: null,
        lang: 'zh',

        userInfo: null, //微信登录后获取的用户信息
        loginCode: '',        //微信登录获取code
        sessionId: '',
        openId:'',
        isLogin: false,       //登录状态
        isWxLogin: false,     //控制是否正在加载获取用户信息接口
        userInfoStorage: null,  //用户信息缓存起来
        msgNum: 0,  //通知公告消息


        //图片和接口地址前缀
        //domainUrl: 'http://192.168.0.244/wuye',           //图片本地机
        domainUrl: 'https://www.5iparks.com/static/wuye',   //图片正式机
        domainUrlDev: 'http://192.168.0.244/wuye',          //图片本地机
        jkUrl: 'https://www.5iparks.com/api',              //接口正式版
        jkDevUrl: 'http://192.168.0.244:8080/api',          //接口开发板

        //判断页面是否刷新参数
        
        indexReach: true, //首页
        indexBacklog:true,//首页待办事项
        userIndexReach: true, //我的页面
        repairReach: false,  //报修页面
        degreesReach: false, //水电录入列表
    }
,  //加载默认配置信息

    onLaunch: function (opt) {

        //在globalData加入功能开关
        this.globalData.appApi = appConfig.appApi
        this.globalData.moduleSwitch = appConfig.moduleSwitch;

        //获取语言
        this.globalData.langData = langJson;
        if (this.globalData.moduleSwitch.lang) {
            this.globalData.lang = wx.getStorageSync('langtype') ? wx.getStorageSync('langtype') : 'zh';
            if (this.globalData.lang == 'en') {
                wx.hideTabBar();
            }
        }

        //判断是否是开发板
        if (opt.query.config == 'dev') {
            this.globalData.jkUrl = this.globalData.jkDevUrl;
            this.globalData.domainUrl = this.globalData.domainUrlDev;
        }

        //获取登录信息
        this.getWxLoginInfo(this);
    },

    //统一的调用接口函数
    requestFn(option) {
        var _this = this;
        let opt = option ? option : null;
        let opt_default = {
            isLoading: true,
            isCloseLoading: true,  //是否关闭加载
            loadTitle: '数据加载中',
            isSessionId: true,
            isLoginTip: false,
            url: '', //前缀不用写
            header: 'application/json',
            method: 'GET',
            data: {},
            dataType: 'json',
            success: null,  //成功且code=0时回调函数
            successOther: null,//接口成功回调函数
            fail: null,     //失败回调函数
            complete: null   //调用接口完回调函数
        };
        opt = opt ? Object.assign(opt_default, opt) : opt_default;
        if (opt.isLoading) { wx.showLoading({ title: opt.loadTitle, mask: true }); }
        wx.request({
            url: this.globalData.jkUrl + opt.url,
            method: opt.method,
            header: {
                "Cache-Control": "max-age=3600", 
                "Content-Type": opt.header,
                "5ipark-sid": opt.isSessionId ? this.globalData.sessionId : '',
                //'5ipark-channel': this.globalData.appApi.channel ? this.globalData.appApi.channel:'',
                "5ipark-aid": this.globalData.appApi.aid ? this.globalData.appApi.aid : ''
            },
            data: opt.data,
            dataType: opt.dataType,
            success: (res) => {
                if (opt.isCloseLoading) { wx.hideLoading(); }
                var apiData = res.data;
                if (apiData.code == 0) {

                    if (opt.success) { opt.success(res, opt.page) }; //成功回调函数

                } else if (apiData.code == 207) {
                    //sessionID失效,跳转到登录页面
                    if (opt.isLoginTip) {
                        wx.showToast({ title: '登录已超时，请重新登录再进行操作！', icon: 'none', duration: 3000 });
                    }

                    if (!_this.globalData.isWxLogin) {
                        _this.globalData.isWxLogin = true;  //控制接口sessionID失效时不会重复调用wxLogin
                        _this.globalData.isLogin = false;
                        _this.globalData.sessionId = ''
                        wx.removeStorageSync('userInfo'); //清除之前缓存
                        //重新调用微信授权
                        _this.getWxLoginInfo(_this, function () {
                            _this.chatData.pageThis.reach();
                        });
                    }

                } else {
                    //this.globalData.isLogin = false;
                    this.globalData.indexReach = true;
                    wx.showToast({ title: res.data.msg, icon: 'none', duration: 3000 });

                }
                opt.successOther && opt.successOther(res);
            },
            fail: (res) => {
                wx.hideLoading();
                wx.showToast({ title: '数据加载失败', icon: 'none', duration: 3000 });
                if (opt.failFn) { opt.failFn() }; //失败回调函数
            },
            complete() {
                if (opt.complete) { opt.complete() }; //失败回调函数
            }
        });
    },

    //当前页加载语言文件包
    loadLangFn(pageThis, page, callback) {
        //设置语言,判断是否切换语言
        var langType = this.globalData.lang;
        if (langType != pageThis.data.lang) {
            var newLangData = this.globalData.langData[page];
            var langPublicData = this.globalData.langData.public;
            newLangData.public = langPublicData;
            var setDatas = {
                lang: langType,
                langData: newLangData
            }
            pageThis.setData(setDatas);
            callback && callback(newLangData, langType);
        }
    },

    //获取自定义菜单列表
    getMenuFn(callback) {
        if (!this.globalData.menuData) {
            this.requestFn({
                url: `/manage/maMenu/list`,
                success: (res) => {
                    var menuData = res.data.data;
                    this.globalData.menuData = menuData;
                    this.globalData.indexReach = true;
                    var moduleSwitch = this.globalData.moduleSwitch;
                    menuData.forEach(item=>{
                        moduleSwitch[item.code] = true;
                    })
                    this.globalData.moduleSwitch = moduleSwitch;
                    callback && callback(res.data.data);
                }
            });
        }else{
            callback && callback(this.globalData.menuData);
        }
    },

    //重置所有刷新状态
    resetAllReach(){
        this.globalData.indexReach =  true //首页
        this.globalData.userIndexReach = true //我的页面
    },

    //获取用户登录信息
    getWxLoginInfo(_this, callback) {
        var _this = this;
        var loginInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : null;  //从缓存获取用户信息
        _this.globalData.userInfoStorage = loginInfo;

        if (!loginInfo) {
            
            _this.wxLogin(() => { //获取登录code

                wx.getSetting({
                    success: res => {    //判断是否已经授权  
                        if (res.authSetting['scope.userInfo']) {    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                            
                            _this.getUserInfo(function (res) {
                                console.log("获取登录信息：", res);
                                _this.afterGetUserInfo(res, function (loginInfo) {
                                    //_this.getImUserInfo();
                                    if (callback) { callback(); }
                                });
                            });

                        } else {
                            _this.afterGetUserInfo('', function () {
                                if (callback) { callback(); }
                            });
                        }
                    }
                });
            });

        } else {
            console.log("缓存获取用户数据：", loginInfo)
            _this.globalData.isLogin = (loginInfo && loginInfo.loginName && loginInfo.userInfo) ? true : false; //登录状态
            _this.globalData.userInfo = loginInfo;
            _this.globalData.sessionId = loginInfo.sessionId;
            this.getImUserInfo();   //获取用户聊天信息
        }
    },

    //小程序登录，获取login_code
    wxLogin(callback) {
        wx.login({
            success: res => {
                this.globalData.loginCode = res.code;
                callback && callback(res.code)
            }
        });
    },

    //获取用户信息
    getUserInfo(callback) {
        wx.getUserInfo({
            success: res => {
                // 可以将 res 发送给后台解码出 unionId
                console.log("获取用户信息：", res);
                callback && callback(res);
            }
        })
    },

    //微信登录后获取登录信息
    afterGetUserInfo(obj, callback) {
        var _this = this;
        var data = {};
        //判断是否已授权，获取不同的参数
        if (obj) {
            data = {
                rawData: obj.rawData,
                encryptedData: obj.encryptedData,
                iv: obj.iv,
                signature: obj.signature
            };
        }
        data['code'] = _this.globalData.loginCode;

        var headData = {
            "Content-Type": "application/x-www-form-urlencoded",
            "5ipark-sid": _this.globalData.sessionId ? _this.globalData.sessionId : "",
            '5ipark-channel': this.globalData.appApi.channel ? this.globalData.appApi.channel : '',
            "5ipark-aid": this.globalData.appApi.aid ? this.globalData.appApi.aid : ''
        };
        wx.request({
            url: _this.globalData.jkUrl + '/manage/wxlogin',
            method: 'post',
            header: headData,
            data: data,
            success: (res) => {
                console.log('wxLogin获取最终用户信息:', res.data);
                if (res.data.code == 0) {
                    var loginInfo = res.data.data;

                    wx.setStorageSync('userInfo', loginInfo); //设置缓存用户信息
                    _this.globalData.userInfo = loginInfo;  //获取用户信息
                    _this.globalData.sessionId = loginInfo.sessionId;
                    _this.globalData.isWxLogin = false; //防止多次调用wxLogin接口

                    if (loginInfo && loginInfo.loginName && loginInfo.userInfo) {
                        _this.globalData.isLogin = true; //登录状态
                    }

                    callback && callback(loginInfo);  //回调函数
                } else {
                    callback && callback();  //回调函数
                    if (_this.chatData.chatPage == 'index') {
                        _this.chatData.pageThis.setData({ hasUserInfo: false });
                        wx.hideTabBar();  //未登录隐藏tab栏
                    }
                }
            },
        });
    },


    //聊天信息
    chatData: {
        chatPage: '',
        pageThis: null,  //当前页面的this
        chatLoginSuccess: false,
        Config: {
            sdkappid: Config.sdkAppID,//
            accountType: Config.accountType,
            accountMode: 0 //帐号模式，0-表示独立模式
        },
        fromUser: null,
        toUser: {
            id: '',
            nick: '',
            faceUrl: ''
        },
    },

    //IM添加好友
    addFriendFn(imId, callback) {
        var _this = this;
        this.getAllFriend(function (res) {

            //循环查找是否有该好友
            var isFriend = false;
            res.forEach(item => {
                if (imId == item.Info_Account) {
                    isFriend = true;
                }
            });

            if (!isFriend) {
                //非好友，先添加
                _this.requestFn({
                    isLoading: false,
                    url: `/im/addFriend`,
                    data: { friendId: imId },
                    header: 'application/x-www-form-urlencoded',
                    method: 'POST',
                    success: (res) => {
                        console.log('添加好友成功！');
                        callback && callback(res);
                    }
                });

            } else {
                //已经是好友
                callback && callback(res);
            }

        })
    },

    //获取IM好友列表
    getAllFriend(callback) {
        var _this = this;
        chatIm.getAllFriend(_this, function (res) {
            var list = res.InfoItem ? res.InfoItem : [];
            list.forEach(item => {
                item.To_Account = item.Info_Account;
                item.C2cNick = item.SnsProfileItem ? item.SnsProfileItem[0].Value : '';
            });
            callback && callback(list);
        });
    },


    //获取聊天IM用户信息
    getImUserInfo() {
        this.requestFn({
            url: '/manage/info4im',
            success: (res) => {
                console.log("聊天接口：", res.data.data);
                this.chatData.fromUser = res.data.data;
                if (this.globalData.isChatLogin) {
                    this.chatLogin();
                }
            }
        })
    },

    //修改IM用户信息
    setUserImg(name, img) {
        var _this = this;
        var options = {
            'ProfileItem': [
                { "Tag": "Tag_Profile_IM_Nick", "Value": name },
                { "Tag": "Tag_Profile_IM_Image", "Value": img }
            ]
        };
        webim.setProfilePortrait(options, function () {
            _this.chatData.fromUser.nick = name;
            _this.chatData.fromUser.faceUrl = img;
        });
    },

    //聊天登录
    chatLogin(callback) {
        var _this = this;
        var loginInfo = {
            'sdkAppID': _this.chatData.Config.sdkappid, //用户所属应用id,必填
            'appIDAt3rd': _this.chatData.Config.sdkappid, //用户所属应用id，必填
            'accountType': _this.chatData.Config.accountType, //用户所属应用帐号类型，必填
            'identifier': _this.chatData.fromUser.id, //当前用户ID,必须是否字符串类型，选填
            'identifierNick': _this.chatData.fromUser.nick, //当前用户昵称，选填
            'userSig': _this.chatData.fromUser.sig, //当前用户身份凭证，必须是字符串类型，选填
        }

        //事件回调对象 监听事件
        var listeners = {
            "onConnNotify": _this.onConnNotify, //监听连接状态回调变化事件,必填
            "onMsgNotify": _this.onMsgNotify//监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
        };

        var options = {};

        //sdk登录(独立模式)
        webim.login(loginInfo, listeners, options, function (resp) {

            var sessMap = webim.MsgStore.sessMap();
            for (var i in sessMap) {
                sess = sessMap[i];
            }
            console.log("登录成功APP", sessMap);
            _this.chatData.chatLoginSuccess = true;
            _this.setUserImg(_this.chatData.fromUser.nick, _this.chatData.fromUser.faceUrl);
            if (callback) { callback() }
        }, function (err) {
            console.log("登录失败", err.ErrorInfo)
        });
    },

    //1v1单聊的话，一般只需要 'onConnNotify' 和 'onMsgNotify'就行了。
    //监听连接状态回调变化事件
    onConnNotify(resp) {
        var info;
        switch (resp.ErrorCode) {//链接状态码
            case webim.CONNECTION_STATUS.ON:
                webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
                break;
            case webim.CONNECTION_STATUS.OFF:
                info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
                webim.Log.warn(info);
                break;
            case webim.CONNECTION_STATUS.RECONNECT:
                info = '连接状态恢复正常: ' + resp.ErrorInfo;
                webim.Log.warn(info);
                break;
            default:
                webim.Log.error('未知连接状态: =' + resp.ErrorInfo); //错误信息
                break;
        }
    },

    //监听新消息事件     注：其中参数 newMsgList 为 webim.Msg 数组，即 [webim.Msg]。
    //newMsgList 为新消息数组，结构为[Msg]
    onMsgNotify(newMsgList, callback) {
        console.log('监听新消息事件333', newMsgList);
        if (!newMsgList) { return };
        var sess, newMsg;
        //获取所有聊天会话
        var selSess = null;
        var sessMap = webim.MsgStore.sessMap();
        var newMsg2 = null;
        for (var j in newMsgList) {//遍历新消息
            newMsg = newMsgList[j];
            if (newMsg.getSession().id() == this.chatData.toUser.id) {//为当前聊天对象的消息
                selSess = newMsg.getSession();
                //在聊天窗体中新增一条消息
                newMsg2 = chatIm.addMsg(this, newMsg);
            }
        }

        //做缓存
        var msgStorage = wx.getStorageSync('msgStorage') ? wx.getStorageSync('msgStorage') : [];
        newMsgList.forEach((item, i) => {
            var isMsg = false;  //当前账号是否有未读消息
            msgStorage.forEach(item2 => {
                if (item2.fromAccount == item.fromAccount) {
                    item2.fromAccount = item.fromAccount
                    item2.unread = item2.unread + 1; //未读消息数
                    isMsg = true;
                }
            });
            if (!isMsg) {
                var nesMsg = {};
                nesMsg.fromAccount = item.fromAccount
                nesMsg.unread = 1; //未读消息数
                msgStorage.push(nesMsg);
            }
        })
        wx.setStorageSync('msgStorage', msgStorage);
        callback && callback();

        if (this.chatData.chatPage == 'chat-detail') { //聊天会话页面
            var chatList = this.chatData.pageThis.data.chatItems.concat(newMsg2);
            chatList.forEach(item => {
                item.headUrl = item.isMy ? this.chatData.fromUser.faceUrl : this.chatData.toUser.faceUrl;
                item.headUrl = item.headUrl ? item.headUrl : (this.globalData.domainUrl + '/images/default/df_userhead.png');
            });
            console.log('chatList:', chatList);
            this.chatData.pageThis.setData({
                chatItems: chatList,
                scrollTopVal: chatList.length * 999
            });

            //消息已读上报，以及设置会话自动已读标记
            webim.setAutoRead(selSess, true, true);

            //阅读消息后清除未读消息缓存
            var msgStorage = wx.getStorageSync('msgStorage') ? wx.getStorageSync('msgStorage') : [];
            msgStorage = msgStorage.filter(item => {
                return item.fromAccount != this.chatData.toUser.id
            });
            wx.setStorageSync('msgStorage', msgStorage);

        } else if (this.chatData.chatPage == 'chat-list') {
            this.chatData.pageThis.initRecentContactList(); //获取会话列表        
        } else if (this.chatData.chatPage == 'index') {
            this.chatData.pageThis.getIndexData(); //获取首页消息数   
        }

        if (this.chatData.chatPage != 'index' && this.chatData.chatPage != 'chat-detail') {
            this.getMessageNumFn();
        }
    },

    //获取公告消息数
    getMessageNumFn(callback) {
        var _this = this;
        var systemLoad = false, noticeLoad = false;
        var systemMsg = 0, noticeMsg = 0;
        var indexData = null;
        _this.requestFn({
            isLoading: false,
            url: '/manage/message/unreadCount',
            success: (res) => {
                noticeMsg= parseInt(res.data.data);
                noticeLoad = true;
                messageSum();
            }
        });

        _this.requestFn({
            isLoading: false,
            url: `/manage/index`,
            success: (res) => {
                indexData = res.data.data;
                systemMsg = parseInt(res.data.data.unreadCt);
                systemLoad = true;
                messageSum();
            }
        });

        function messageSum(){
            if (!systemLoad || !noticeLoad){
                return;
            }
            var msgStorage = wx.getStorageSync('msgStorage') ? wx.getStorageSync('msgStorage') : [];
            var chatMsg = msgStorage.reduce((prev, cur) => {
                return cur.unread + prev
            }, 0);
            var sumNum = noticeMsg + chatMsg + systemMsg;
            if (sumNum > 0) {
                //设置菜单栏消息数
                wx.setTabBarBadge({
                    index: 1,
                    text: sumNum.toString()
                });
            } else {
                wx.removeTabBarBadge({ index: 1 });
            }
            var returnData = {
                sumNum: sumNum,
                noticeMsg: noticeMsg,
                systemMsg: systemMsg,
                chatMsg: chatMsg,
                indexData: indexData
            }
            callback && callback(returnData);
        }
    },
    // getIndexData() {
    //     var _this = this;
    //     _this.requestFn({
    //         isLoading: false,
    //         url: '/manage/message/unreadCount',
    //         success: (res) => {

    //             var num = parseInt(res.data.data);
    //             _this.requestFn({
    //                 isLoading: false,
    //                 url: `/manage/index`,
    //                 success: (res) => {

    //                     var noticeNum = res.data.data.unreadCt;
    //                     var msgStorage = wx.getStorageSync('msgStorage') ? wx.getStorageSync('msgStorage') : [];
    //                     var msgNum = msgStorage.reduce((prev, cur) => {
    //                         return cur.unread + prev
    //                     }, 0);
    //                     var sumNum = noticeNum + msgNum + num;
    //                     if (sumNum > 0) {
    //                         //设置菜单栏消息数
    //                         wx.setTabBarBadge({
    //                             index: 1,
    //                             text: sumNum.toString()
    //                         });
    //                     } else {
    //                         wx.removeTabBarBadge({ index: 1 });
    //                     }
    //                 }
    //             });

    //         }
    //     });
    // },

    //预览图片（当前图片地址，图片地址列表）
    previewImgFn(currentImg, imgList) {
        wx.previewImage({
            current: currentImg,  // 当前显示图片的http链接
            urls: imgList         // 需要预览的图片http链接列表
        })
    }


})
