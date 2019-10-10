const app = getApp();
var commonFn = require('../../../utils/common.js');
var webim = require('../../../utils/webim_wx.js');
var chatIm = require('../../../utils/chatIm.js');

Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        isNoData: true,
        noData: app.chatData.imageUrl + '/no-msg.png',//无数据的图片
        contactList: [],//会话列表
        indexData: null,
        listInfo: [],
        msgData:null,
        tabMsgNum:0,

        langData:null,
        lang:''
    },

    onLoad: function (options) {
        
    },

    gotoChat: function (e) {
        let item = e.currentTarget.dataset.item;
        var toUserData = {
            id: item.To_Account,
            nick: item.C2cNick,
            faceUrl: item.C2cImage
        }
        app.chatData.toUser = toUserData;
        wx.navigateTo({ url: `../chat/chat` });
    },

    onShow: function () {
        var that = this;
        app.chatData.pageThis = this;
        app.chatData.chatPage = 'chat-list';

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'chat', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });
        
        //未读消息数
        app.getMessageNumFn((res)=>{
            console.log('xiaoxi:', res)
            this.setData({ 
                msgData : res ,
                tabMsgNum : res.sumNum
            });
        });

        var selToID = ''; //会话列表不设置对方私聊账号
        var timer = setInterval(() => {
            if (app.chatData.chatLoginSuccess) {
                clearInterval(timer);
                //that.getAllFriend();
                that.initRecentContactList(); //获取会话列表
            }
        }, 300);
    },

    onHide: function () {
        app.chatData.pageThis = null;
        app.chatData.chatPage = '';
    },

    //获取好友列表
    getAllFriend() {
        var that = this;
        chatIm.getAllFriend(app, function (res) {
            var list = res.InfoItem;
            list.forEach(item => {
                item.To_Account = item.Info_Account;
                item.C2cNick = item.SnsProfileItem ? item.SnsProfileItem[0].Value : '';
            });
            console.log('所有好友列表：', list);
            that.setData({ contactList: list })
        });
    },

    //初始化聊天界面最近会话列表
    initRecentContactList: function () {
        var that = this;
        webim.getRecentContactList({//获取会话列表的方法
            'Count': 20   //最近的会话数 ,最大为 100
        }, function (resp) {
            console.log('获取最近会话：', resp);
            var sessMap = webim.MsgStore.sessMap();

            if (resp.SessionItem) {
                var sessionList = resp.SessionItem
                if (sessionList.length == 0) {
                    that.setData({ isNoData: false })
                    wx.hideLoading();
                } else if (sessionList.length > 0) {

                    var userId = sessionList.map((item, index) => {
                        return item.To_Account
                    })
                    that.getAvatar(userId, sessionList, function (data) {
                        var msgStorage = wx.getStorageSync('msgStorage') ? wx.getStorageSync('msgStorage') : [];
                        var lastMsg = wx.getStorageSync('lastMsg') ? wx.getStorageSync('lastMsg') : []; //最后消息，用于下次访问判断是否有未读消息
                        var lastMsg2 = [];
                        data = data.map((item, index) => {
                            var unreadNum = 0;
                            //下次访问获取是否有未读消息（由于未登录状态下接受的消息在下次登录时未能接收到的）
                            if (lastMsg.constructor === Array) {
                                lastMsg.forEach(item2 => {
                                    if (item2.fromAccount == item.To_Account) {
                                        var last_msg = item.MsgShow
                                        if (item2.lastMsg != last_msg) {
                                            unreadNum = 1
                                        }
                                    }
                                });
                            }

                            //实时监听的未读消息
                            msgStorage.forEach(item2 => {
                                if (item2.fromAccount == item.To_Account) {
                                    unreadNum = item2.unread;
                                }
                            });
                            item.unread = unreadNum;


                            lastMsg2.push({
                                fromAccount: item.To_Account,
                                lastMsg: item.MsgShow
                            });
                            if (item.MsgShow == '[其他]') {
                                item.MsgShow = '[图片]'
                            }
                            return item;
                        });
                        wx.setStorageSync('lastMsg', lastMsg2);
                        that.setData({ contactList: data })
                        console.log('最后消息：', data);
                        wx.hideLoading();
                        // 初始化最近会话的消息未读数(监听新消息事件)
                        //webim.syncMsgs(app.onMsgNotify());

                    })
                    //webim.syncMsgs(that.initUnreadMsgCount())
                } else {
                    wx.hideLoading()
                    return;
                }
            } else {
                wx.hideLoading()
            }


        }, function (resp) {
            //错误回调
        });


    },

    // 初始化最近会话的消息未读数（这个方法用不到，多余，这是个坑，登录之后仍然返回空对象）
    initUnreadMsgCount: function () {
        var sess;
        var sessMap = JSON.stringify(webim.MsgStore.sessMap());
        console.log(sessMap)
        for (var i in sessMap) {
            sess = sessMap[i];
            // if (selToID && selToID != sess.id()) { //更新其他聊天对象的未读消息数
            console.log('sess.unread()', sess.unread());
            // updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
            // }
        }
    },

    //获取会话列表所有用户头像
    getAvatar: function (userId, item, callback) {
        var that = this;
        var tag_list = ['Tag_Profile_IM_Nick', 'Tag_Profile_IM_Image']
        //用户id
        var account = userId
        var options = {

            To_Account: account,
            LastStandardSequence: 0,
            TagList: tag_list,
        };
        var contactList = [];

        webim.getProfilePortrait(
            options,
            function (res) {
                var UserProfileItem = res.UserProfileItem;
                var C2cNick, C2cImage;
                // 循环添加昵称和头像
                contactList = item.map((item, index) => {
                    var MsgTimeStamp = commonFn.getDate(item.MsgTimeStamp * 1000).substring(5, 16);
                    item.MsgTimeStamp = MsgTimeStamp;
                    if (UserProfileItem[index].ProfileItem) {
                        item.C2cNick = UserProfileItem[index].ProfileItem[0].Value;
                        item.C2cImage = UserProfileItem[index].ProfileItem[1].Value;
                    }
                    return item;
                })
                callback && callback(contactList);
            },
            function (res) {
                console.log("获取用户头像昵称失败：", res);
            }
        )

    },
})