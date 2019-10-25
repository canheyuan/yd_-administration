const commonFn = require('../../../utils/common.js');
const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        orderId:'',
        detailData: null, //详情页数据
        ammeterMetersData: null,  //本月电表数据
        ammeterPrevMetersData: null,  //上月电表数据
        waterMetersData: null, //本月水表数据
        watePrevMetersData: null,//上月水表数据

        handleType:'',  //操作类型
        popData:null,   //弹窗里的数据
        tipPopData:{
            approve:{
                show: true,
                title: '审核通过',
                des: '确定通过该账单吗？',
                callOffFnName: 'closeTipPop',
                confirmFnName: 'handleFn',
            },
            reject: {
                show: true,
                title: '审核拒绝',
                des: '确定拒绝该账单吗？',
                callOffFnName: 'closeTipPop',
                confirmFnName: 'handleFn',
            },
            ignore: {
                show: true,
                title: '忽略账单',
                des: '确定忽略该账单吗？',
                callOffFnName: 'closeTipPop',
                confirmFnName: 'handleFn',
            },
            generate: {
                show: true,
                title: '重新生成账单',
                des: '确定重新生成该账单吗？',
                callOffFnName: 'closeTipPop',
                confirmFnName: 'handleFn',
            },
        }
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        this.setData({ orderId: options.id ? options.id:'' })
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'fee', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });
        //this.getFeeDetail(options.id);
        this.getFeeDetail('e528e6504a6fb54934bd9ff9d319a56e');  //未抄表
    },

    //获取报修详情
    getFeeDetail(id) {
        var lang = app.globalData.lang;
        var langData = this.data.langData;
        app.requestFn({
            url: `/manage/bill/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                detailData.month = detailData.feePeriod.substring(5, 7);  //获取月份
                //状态status: 0异常 1未审核 2未缴费 3已缴费 4已开票 5支付中 6退款 9已取消
                detailData.statusName = langData['statusName' + detailData.status][lang];

                //获取各类信息
                detailData.fees.forEach((item) => {
                    if (item.feeType == "rent") { //租金
                        detailData.rent = item
                    } else if (item.feeType == "electric") { //电费
                        detailData.electric = item
                    } else if (item.feeType == "water") { //水费
                        detailData.water = item
                    }
                })
                this.setData({ detailData: detailData });
                console.log('账单详情：', detailData);
            }
        });

    },

    //打开提示弹窗
    openTipPop(e){   
        var handleType = e.currentTarget.dataset.type;
        var popData = this.data.tipPopData[handleType];
        this.setData({
            handleType: handleType,
            popData: popData
        })
    },

    //关闭弹窗
    closeTipPop(){
        this.setData({
            popData: {}
        })
    },

    //操作
    handleFn(e){
        var _this = this;
        var orderId = this.data.orderId;
        var handleType = this.data.handleType;
        var apiUrl = '';
        if (!handleType){ return; }
        switch (handleType){
            case 'approve': //审核通过
                apiUrl = `/manage/bill/approve/${orderId}`
                break;
            case 'reject':  //审核拒绝
                apiUrl = `/manage/bill/reject/${orderId}`
                break;
            case 'ignore':    //忽略异常
                apiUrl = `/manage/bill/ignore/${orderId}`
                break;
            case 'generate':    //重新生成
                apiUrl = `/manage/bill/generate/${orderId}`
                break;
        }
        console.log('apiUrl', apiUrl, handleType)
        return;
        app.requestFn({
            url: apiUrl,
            method:'POST',
            success: (res) => {
                _this.getFeeDetail(orderId);
            }
        });
    }
    
})