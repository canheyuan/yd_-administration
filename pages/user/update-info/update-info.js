const app = getApp();  //获取应用实例
var commonFn = require('../../../utils/common.js'); //一些通用的函数
const datas = require('updata-data.js');//页面内容数据
Page({

  //页面的初始数据
  data: {
    pageData:{},  //渲染到页面的数据
    valueTxt:'',
    changeName:'',

    langData: null,
    lang: ''
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {

      app.loadLangFn(this, 'userIndex', (res, lang) => {
          wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
          this.setData({
              sexList: [res.sexName1[lang], res.sexName2[lang], res.sexName3[lang]]
          })
      });
      
    var updata_type = options.type;
    var default_value = options.value;
    let pageInfo = datas.updataInfo[updata_type];
    //设置加载的内容和文本框默认值
    this.setData({
      pageData: pageInfo,
      valueTxt:default_value,
      changeName:updata_type
    });
    //设置title
    wx.setNavigationBarTitle({
      title: this.data.pageData.pageTitle
    })
  },

  //清除文本框
  clearInputFn(){
    this.setData({
      valueTxt:''
    });
  },

  //提交数据
  formSubmit(e){
    var _this = this;
    var formData = e.detail.value;
    if (_this.data.changeName == 'cellphone' && !commonFn.phoneregFn(formData.cellphone)) {
      wx.showToast({ title: '手机号格式不正确!', icon: "none", duration: 2000 });
      return;
    }
    if (_this.data.changeName == 'email' && !commonFn.emailRegFn(formData.email)){
      wx.showToast({ title: '邮箱格式不正确!', icon: "none", duration: 2000 });
      return;
    }
    app.requestFn({
      loadTitle:'提交中',
      url: `/manage/userInfo/update`,
      data: formData,
      header:'application/x-www-form-urlencoded',
      method: 'POST',
      success: (res) => {
        //获取缓存，改变缓存里的信息，然后重新设置缓存
        var userInfoStorage = wx.getStorageSync('userInfo');
        userInfoStorage.userInfo[_this.data.changeName] = formData[_this.data.changeName];
        wx.setStorageSync('userInfo', userInfoStorage); //设置缓存用户信息
        app.globalData.userInfo = userInfoStorage;  //获取用户信息
        app.globalData.userIndexReach = true;
        app.globalData.indexReach = true;
        wx.showToast({ title: '修改成功!', icon: "success", duration: 2000 });
        setTimeout(function () {
          wx.navigateBack();
        }, 2000);
      }
    });
  
  }
})