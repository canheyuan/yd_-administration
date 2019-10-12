
const app = getApp();   //获取应用实例
var webim = require('../../../utils/webim_wx.js');
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        appVersion: app.globalData.appVersion, //更新的版本号
        userInfo: null,  //用户信息
        userData: null,
        sexList: null,  //性别选择
        sexIndex: 0,
        tabMsgNum: 0,
        moduleSwitch: null,

        pickerLang: {
            list: ['中文', 'English'],
            index: 0
        },

        langData: null,
        lang: ''
    },

    //生命周期函数--监听页面加载
    onShow: function (options) {
        if (app.globalData.userIndexReach) {
            app.globalData.userIndexReach = false;

            this.reach();
        }else{
            app.getMessageNumFn((res) => {
                this.setData({ tabMsgNum: res.sumNum });
            })
        }
    },

    //下拉刷新
    onPullDownRefresh() {
        this.reach();
        wx.stopPullDownRefresh();
    },

    //加载我的数据
    reach(){
        var langIndex = wx.getStorageSync('langtype') == 'en' ? 1 : 0;
        this.setData({ ['pickerLang.index']: langIndex });

        //加载语言
        app.loadLangFn(this, 'userIndex', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                sexList: [res.sexName1[lang], res.sexName2[lang], res.sexName3[lang]]
            })
        });

        var loginInfo = app.globalData.userInfo;
        this.setData({
            moduleSwitch: app.globalData.moduleSwitch,
            userInfo: loginInfo.userInfo,
            sexIndex: loginInfo.userInfo.sex ? loginInfo.userInfo.sex : 0
        });
        //获取消息数
        app.getMessageNumFn((res) => {
            this.setData({  tabMsgNum: res.sumNum });
        })
    },

    //切换语言
    changeLangFn(e) {
        var index = e.detail.value;
        this.setData({ ['pickerLang.index']: index });
        var langType = index == 1 ? 'en' : 'zh';
        if (langType == app.globalData.lang) {   //如果语言没改变，就不执行下面的
            return;
        }
        if (langType == 'en') {
            wx.hideTabBar();
        } else {
            wx.showTabBar();
        }
        app.globalData.lang = langType;;
        wx.setStorageSync('langtype', langType);
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'userIndex', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                sexList: [res.sexName1[lang], res.sexName2[lang], res.sexName3[lang]]
            })
        });

        //重置所有刷新状态
        app.resetAllReach();
    },
    
    //修改头像
    changeHeadImgFn(e){
        var langData = this.data.langData;
        var lang = this.data.lang;
        var _this = this;
        //选择图片   
        app.chooseImg({
            sizeType: ['compressed'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths;
                //上传图片文件
                app.uploadFile({
                    imgUrl: tempFilePaths[0],
                    entityType: 'user',
                    success: (res) => {
                        var changeImg = res.filePath;
                        var changeImg2 = res.urlPath;

                        app.requestFn({
                            isLoading:false,
                            //loadTitle: langData.public.editTip[lang],
                            url: `/manage/userInfo/update`,
                            header: 'application/x-www-form-urlencoded',
                            data: {
                                "headImgs": changeImg
                            },
                            method: 'POST',
                            success: (res) => {
                                console.log("修改头像成功：", res.data);
                                //获取缓存，改变缓存里的信息，然后重新设置缓存
                                var loginInfo = wx.getStorageSync('userInfo');
                                loginInfo.userInfo['headImgs'] = changeImg2;
                                wx.setStorageSync('userInfo', loginInfo); //设置缓存用户信息
                                app.globalData.userInfo = loginInfo;  //获取用户信息
                                _this.setData({ ["userInfo.headImgs"]: changeImg2 });
                                wx.showToast({ title: langData.public.editSuccess[lang], icon: "success", duration: 2000 });
                                app.globalData.userIndexReach = true;
                                app.globalData.indexReach = true;
                                _this.setUserImg(changeImg2);
                            }
                        });
                    },
                })

            }
        })
    },


    //修改IM用户信息
    setUserImg(img) {
        var _this = this;
        var options = {
            'ProfileItem': [
                { "Tag": "Tag_Profile_IM_Image", "Value": img }
            ]
        };
        webim.setProfilePortrait(options, function () {
            app.chatData.fromUser.faceUrl = img;
        });
    },


    //打开或关闭 退出提示弹窗
    outPopFn() {
        this.setData({  outPop: !this.data.outPop  })
    },

    //修改性别
    sexChange(e) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        var _this = this;
        app.requestFn({
            isLoading:false,
            url: `/manage/userInfo/update`,
            header: 'application/x-www-form-urlencoded',
            data: {
                "sex": e.detail.value
            },
            method: 'POST',
            success: (res) => {
                console.log("修改性别成功：", res.data);
                //获取缓存，改变缓存里的信息，然后重新设置缓存
                var loginInfo = wx.getStorageSync('userInfo');
                loginInfo.userInfo['sex'] = e.detail.value;
                wx.setStorageSync('userInfo', loginInfo); //设置缓存用户信息
                app.globalData.userInfo = loginInfo;  //获取用户信息
                _this.setData({ sexIndex: e.detail.value });
                wx.showToast({ title: langData.public.editSuccess[lang], icon: "success", duration: 2000 });
                app.globalData.userIndexReach = true;
            }
        });

    },

    //退出登录
    outLoginFn(e) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            loadTitle: langData.outTip[lang],
            url: `/manage/logout`,
            success: (res) => {
                console.log("退出登录成功：", res.data);
                wx.clearStorageSync();  //清除缓存
                app.globalData.userIndexReach = true;
                app.globalData.menuData = null;
                webim.logout();
                wx.redirectTo({ url: '/pages/common/login/login' });
            }
        });
    },

    //跳转到修改信息页面
    gotoChange(e) {
        var c_type = e.currentTarget.dataset.type
        var c_value = e.currentTarget.dataset.value
        wx.navigateTo({
            url: '/pages/user/update-info/update-info?type=' + c_type + "&value=" + c_value
        })
    },

})
