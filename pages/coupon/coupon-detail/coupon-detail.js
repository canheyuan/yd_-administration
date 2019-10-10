const app = getApp();
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        detailData: null, //详情数据

        langData: null,
        lang: ''
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'coupon', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });
        this.getDetailFn(options.id);
        // this.getDetailFn('VEF3Z20B5G');
    },

    //获取数据
    getDetailFn(id) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            url: `/manage/userCoupon/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                //循环数组转换时间戳
                detailData.useStart = detailData.useStart.slice(5, 11);
                detailData.useEnd = detailData.useEnd.slice(5, 11);
                detailData.issueTime = detailData.issueTime.slice(5, 16);

                if (detailData.couponType == 1) {
                    var discountArr = detailData.discountText.split(',');
                    detailData.discountPrice = discountArr[1] + langData.yuanText[lang];
                    detailData.discountSumPrice = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text1[lang]}` : langData.text3[lang];
                } else if (detailData.couponType == 2) {
                    var discountArr = detailData.discountText.split(',');
                    detailData.discountPrice = discountArr[1] + langData.zheText[lang];
                    detailData.discountSumPrice = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text2[lang]}` : langData.text3[lang];
                }

                switch (detailData.status) {
                    case 0:
                        detailData.btnName = langData.btnName4[lang];
                        break;
                    case 1:
                        detailData.btnName = langData.btnName2[lang];
                        break;
                    case 2:
                        detailData.btnName = langData.btnName3[lang];
                        break;
                }
                this.setData({ detailData: detailData });
            }
        });
    },

    //确认核销
    verifyExchangeFn() {
        var couponCode = this.data.detailData.couponCode;
        app.requestFn({
            header: 'application/x-www-form-urlencoded',
            url: `/manage/userCoupon/check`,
            data: {
                couponCode: couponCode
            },
            method: 'post',
            success: (res) => {
                wx.navigateTo({
                    url: `/pages/coupon/exchange-result/exchange-result?id=${couponCode}`,
                })
            }
        });
    }
})