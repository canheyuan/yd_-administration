const app = getApp(); //获取应用实例
Page({
  //页面的初始数据
  data: {
    domainUrl: app.globalData.domainUrl,
    detailsData: null,     //详情数据

    langData:null,
    lang:''
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'fee', (res,lang) => {
          wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
      });

    this.getDetaisFn(options.id);
  },

  //获取互动详情信息
  getDetaisFn(id) {
    var _this = this;
    app.requestFn({
      url: `/manage/bill/feeDetail/${id}`,
      success: (res) => {
        console.log("缴费详情：", res.data.data);
        var data = res.data.data;
        data.month = data.bill.feePeriod.substring(5, 7);
        this.setData({
          detailsData: data
        });
      }
    });
  }
})