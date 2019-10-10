const commonFn = require('../../../utils/common.js');
const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null, //详情页数据
        ammeterMetersData: null,  //本月电表数据
        ammeterPrevMetersData: null,  //上月电表数据
        waterMetersData: null, //本月水表数据
        watePrevMetersData: null,//上月水表数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'fee', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });
        this.getFeeDetail(options.id);
        //this.getFeeDetail('30cfcb361decf74bca0416ccdf14a73e');  //未抄表
    },

    //获取报修详情
    getFeeDetail(id) {
        app.requestFn({
            url: `/manage/bill/detail/${id}`,
            success: (res) => {
                var detailsData = res.data.data;
                console.log(detailsData);
                detailsData.month = detailsData.feePeriod.substring(5, 7);  //获取月份
                //获取各类信息
                detailsData.fees.forEach((item) => {
                    if (item.feeType == "rent") { //租金
                        detailsData.rent = item
                    } else if (item.feeType == "electric") { //电费
                        detailsData.electric = item
                    } else if (item.feeType == "water") { //水费
                        detailsData.water = item
                    }
                })
                this.setData({ detailsData: detailsData });
            }
        });

    }
})