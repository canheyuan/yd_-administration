
const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
Page({
  data: {
    domainUrl: app.globalData.domainUrl,
    detailData: null, //详情数据
    langData:null,
    lang:''
  },

  /** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'coupon', (res,lang) => {
          wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
      });
    this.getDetailFn(options.id);
  },

  //获取数据
  getDetailFn(id) {
    app.requestFn({
      url: `/manage/userCoupon/detail/${id}`,
      success: (res) => {
        var detailData = res.data.data;
        console.log('核销成功页返回信息：',detailData);
        //循环数组转换时间戳
        detailData.useStart = commonFn.getDate(detailData.useStart).slice(5, 11);
        detailData.useEnd = commonFn.getDate(detailData.useEnd).slice(5, 11);
        detailData.issueTime = commonFn.getDate(detailData.issueTime).slice(5, 16);

          if (detailData.couponType == 1) {
              var discountArr = detailData.discountText.split(',');
              detailData.discountTxt = discountArr[0] > 0 ? `${langData.manText}${discountArr[0]}${langData.text1}${discountArr[1]}${langData.public.yuanText}` : `${langData.jianText}${discountArr[1]}${langData.public.yuanText}`
          } else if (detailData.couponType == 2) {
              var discountArr = detailData.discountText.split(',');
              detailData.discountTxt = discountArr[0] > 0 ? `${langData.manText}${discountArr[0]}${langData.text4}${discountArr[1]}${langData.public.zheText}` : `${discountArr[1]}${langData.public.zheText}`
          }

        this.setData({ detailData: detailData });
      }
    });
  },

})