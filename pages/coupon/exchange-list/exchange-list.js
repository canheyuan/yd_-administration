const app = getApp();
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({

  //页面的初始数据
  data: {
    domainUrl: app.globalData.domainUrl,
    currentTagName: 0,
    listInfo: {},   //列表数据
    coupopPopIsShow: false,  //优惠券弹窗是否显示

    langData:null,
    lang:''
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'coupon', (res, lang) => {
          wx.setNavigationBarTitle({ title: res.recordTitle[lang] });  //设置当前页面的title
      });
    this.getListInfo(true);
  },

  //生命周期函数--监听页面显示
  onShow: function () {

  },

  //选项卡切换
  tagChange(e) {
    var index = e.currentTarget.dataset.index;
    var nowIndex = this.data.currentTagName;
    if (index == nowIndex){
      return;
    }else{
      this.setData({ 
        currentTagName: index,
        ['listInfo.pageNum']:1
      });
      this.getListInfo(true);
    }

  },

  //跳转到详情页
  gotoDetailFn(e){
    var url = '/pages/coupon/coupon-detail/coupon-detail?id=' + e.currentTarget.dataset.id ;
    wx.navigateTo({ url: url });
  },

  //获取列表数据
  getListInfo(isReach) {
      var langData = this.data.langData;
      var lang = this.data.lang;
    var _this = this;
    listFn.listPage({
      url: `/manage/userCoupon/checkedList`,
      data:{

      },
      isReach: isReach,
      page: _this,
      listDataName: 'listInfo',
      getListDataFn: (listdata) => {
        //返回列表数据和总数
        return {
          list: listdata.data,
          total: listdata.total
        }
      },
      disposeFn: (listItem) => {
        //对列表循环操作改变数据
        var listItem = listItem;
        if (listItem) {
          //循环数组转换时间戳
          listItem.useStart = listItem.useStart.slice(5, 11);
          listItem.useEnd = listItem.useEnd.slice(5, 11);
          listItem.issueTime = listItem.issueTime.slice(5, 16);
          
            if (listItem.couponType == 1) {
                var discountArr = listItem.discountText.split(',');
                listItem.discountPrice = discountArr[1] + langData.yuanText[lang];
                listItem.discountSumPrice = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text1[lang]}` : langData.text3[lang];
            } else if (listItem.couponType == 2) {
                var discountArr = listItem.discountText.split(',');
                listItem.discountPrice = discountArr[1] + langData.zheText[lang];
                listItem.discountSumPrice = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text2[lang]}` : langData.text3[lang];
            }

        }
        return listItem;
      },
      success: () => {
        console.log("我的优惠券接口：", _this.data.listInfo);
      }

    });
  },

  //上拉到底部加载更多函数
  loadMoreListFn: function () {
    var _this = this;
    var listInfo = this.data.listInfo;
    listFn.listLoadMore({
      pageNum: listInfo.pageNum,
      pageSize: listInfo.pageSize,
      pageTotal: listInfo.pageTotal,
      getListFn: (isReach) => {
        _this.getListInfo(isReach);
      }
    });
  },

  //关闭弹窗
  closeCoupopPop() {
    this.setData({
      coupopPopIsShow: false
    })
  }
  
})