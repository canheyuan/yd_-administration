
const app = getApp(); //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
var WxParse = require('../../../wxParse/wxParse.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        veneuDetails: null,  //详情数据

        isPopHide: true, //确认弹窗是否隐藏
        popTipTitle: '',  //弹窗提示内容
        operation: '', //操作类型

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'venue', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.reserveTitle[lang] });  //设置当前页面的title
        });

        this.getDetailsFn(options.id);
    },


    //打开弹窗
    openPop(e) {
        var title = e.currentTarget.dataset.tip;
        var operation = e.currentTarget.dataset.operation;
        this.setData({
            popTipTitle: title,
            operation: operation,
            isPopHide: !this.data.isPopHide
        });
    },

    //取消关闭弹窗
    cancelFn() {
        this.setData({
            isPopHide: !this.data.isPopHide
        });
    },
    //获取详情页数据
    getDetailsFn(chamberId) {
        var _this = this;
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            //url: `/manage/chamber/detail/${chamberId}`,
            url: `/manage/chamber/orderDetail/${chamberId}`,
            success: (res) => {
                var detailData = res.data.data;
                switch (detailData.order.status) {
                    case 1:
                        detailData.statusName = langData.statusName1[lang];
                        detailData.statusClass = '';
                        break;
                    case 2:
                        detailData.statusName = langData.statusName2[lang];
                        detailData.statusClass = 'follow';
                        break;
                    case 3:
                        detailData.statusName = langData.statusName3[lang];
                        detailData.statusClass = 'done';
                        break;
                    case 9:
                        detailData.statusName = langData.statusName9[lang];
                        detailData.statusClass = '';
                        break;
                }

                detailData.order.veneuTime = commonFn.getDate(detailData.order.orderStart).substring(0, 16) + langData.public.toText[lang] + commonFn.getDate(detailData.order.orderEnd).substring(11, 16);
                _this.setData({ veneuDetails: detailData });   //设置data数据
            }
        });
    },

    //确认
    affirmFn(e) {
        var operation = this.data.operation;
        if (operation == 'agree') {
            this.agreeFn();  //同意
        } else if (operation == 'reject') {
            this.rejectFn();
        }
    },

    //同意预定
    agreeFn() {
        var lang = this.data.lang;
        var _this = this;
        var id = _this.data.veneuDetails.order.id;
        app.requestFn({
            url: `/manage/chamber/approve/${id}`,
            success: (res) => {
                this.cancelFn();
                wx.showToast({ title: _this.data.langData.agreeTip[lang], icon: 'success', duration: 3000 });
                app.globalData.indexReach = true;
                _this.getDetailsFn(_this.data.veneuDetails.order.id);
            }
        });
    },

    //拒绝预定
    rejectFn() {
        var lang = this.data.lang;
        var _this = this;
        var id = _this.data.veneuDetails.order.id;
        app.requestFn({
            url: `/manage/chamber/reject/${id}`,
            success: (res) => {
                this.cancelFn();
                wx.showToast({ title: _this.data.langData.rejectTip[lang], icon: 'success', duration: 3000 });
                app.globalData.indexReach = true;
                _this.getDetailsFn(_this.data.veneuDetails.order.id);
            }
        });
    },



    //图片加载失败显示默认图
    errorImgFn(e) {
        console.log('图片加载失败', e.currentTarget.dataset.obj)
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },
})