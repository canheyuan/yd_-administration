
const app = getApp();   //获取应用实例
//获取页面内容
const datas = require('data.js');
const pageInfo = datas.page_data;

Page({
  data: {
    domainUrl: app.globalData.domainUrl,
    pageData: {},
    langData:null,
    lang:''
  },

  /** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'coupon', (res,lang) => {
          wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
      });
    var pageData = options.page ? pageInfo[options.page] : pageInfo['coupon404'];
    this.setData({
      pageData: pageData
    })
    wx.setNavigationBarTitle({
      title: pageData.page_title
    })
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
            wx.navigateTo({
              url: goUrl,
            });
          }
        })

      }
    });
  },
})