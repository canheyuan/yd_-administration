const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js');
const formTip = require('../../../utils/validateForm.js');   //验证

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        orderId: '',
        detailData: null, //详情页数据
        ammeterMetersData: null,  //本月电表数据
        ammeterPrevMetersData: null,  //上月电表数据
        waterMetersData: null, //本月水表数据
        watePrevMetersData: null,//上月水表数据

        handleType: '',  //操作类型
        popData: null,   //弹窗里当前的数据
        tipPopData: {},  //弹窗数据

        payPopShow: false,   //确认弹窗
        payImgUrl: '',    //临时图片
        payDate: ''  //支付日期 xxxx-xx-xx

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        
        this.setData({ orderId: options.id ? options.id : '' })
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'fee', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            var tipPopData = {
                approve: {
                    show: true, //弹窗是否显示
                    title: res.approveTitle[lang],  //标题
                    des: res.approveDes[lang],  //提示文字
                    tipText: res.approveTip[lang],
                    callOffFnName: 'closeTipPop',   //取消函数名
                    confirmFnName: 'handleFn',  //确定函数名
                },
                reject: {
                    show: true,
                    title: res.rejectTitle[lang],
                    des: res.rejectDes[lang],
                    tipText: res.rejectTip[lang],
                    callOffFnName: 'closeTipPop',
                    confirmFnName: 'handleFn',
                },
                ignore: {
                    show: true,
                    title: res.ignoreTitle[lang],
                    des: res.ignoreDes[lang],
                    tipText: res.ignoreTip[lang],
                    callOffFnName: 'closeTipPop',
                    confirmFnName: 'handleFn',
                },
                generate: {
                    show: true,
                    title: res.generateTitle[lang],
                    des: res.generateDes[lang],
                    tipText: res.generateTip[lang],
                    callOffFnName: 'closeTipPop',
                    confirmFnName: 'handleFn',
                }
            }
            this.setData({  tipPopData: tipPopData })
            this.getFeeDetail(options.id);
        });

        //this.getFeeDetail('e528e6504a6fb54934bd9ff9d319a56e');  //未抄表
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
                detailData.fees.forEach((item) => {  //获取各类信息
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
    openTipPop(e) {
        var handleType = e.currentTarget.dataset.type;
        var popData = this.data.tipPopData[handleType];
        this.setData({
            handleType: handleType,
            popData: popData
        })
    },

    //关闭弹窗
    closeTipPop() {
        this.setData({ popData: {} })
    },

    //操作
    handleFn(e) {
        var _this = this;
        var orderId = this.data.orderId;
        var handleType = this.data.handleType;
        var apiUrl = '';
        if (!handleType) { return; }
        switch (handleType) {
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

        app.requestFn({
            url: apiUrl,
            method: 'POST',
            success: (res) => {
                app.globalData.feeReach = true;
                wx.showToast({ title: _this.data.popData.tipText, icon: 'success', duration: 2000 });
                _this.closeTipPop();
                setTimeout(() => {
                    _this.getFeeDetail(orderId);
                }, 1500)
            }
        });
    },

    //打开确认缴费弹窗
    payPopFn() {
        this.setData({ payPopShow: !this.data.payPopShow })
    },

    //选择日期
    changeDate(e) {
        var value = e.detail.value;
        this.setData({ payDate: value });
        console.log('payDate', this.data.payDate);
    },

    //选择支付凭证
    chooseImg(e) {
        var _this = this;
        app.chooseImg({
            sizeType: ['original'],   //所选图片尺寸（原图、压缩）
            sourceType: ['album', 'camera'],    //选择图片的来源（从相册选图、使用相机）
            success: (res) => {
                var imgList = res.tempFilePaths;
                this.setData({ payImgUrl: imgList[0] })
            }
        })
    },

    //预览图片
    previewImgFn(e) {
        var imgUrl = e.currentTarget.dataset.img;
        app.previewImgFn(imgUrl, [imgUrl]);
    },

    //提交确认缴费
    affirmPayFn(e) {
        var _this = this;
        var orderId = this.data.orderId;
        var payDate = this.data.payDate;    //支付日期
        var imgUrl = this.data.payImgUrl;   //凭证图片
        var langData = this.data.langData;
        var lang = this.data.lang;
        //验证
        var isTip = formTip([
            { name: 'empty', verifyText: payDate, tipText: langData.payDateTip[lang]},
            { name: 'empty', verifyText: imgUrl, tipText: langData.payImgTip[lang] },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序
        app.uploadFile({
            isLoading:true,
            imgUrl: imgUrl,  //上传的图片地址
            fileName: 'file',
            entityType: 'order',
            ignoreCheck:1,
            success: (res) => {   //成功回调函数
                var changeImg = res.filePath;    //相对路径
                var formData = {
                    payTime: payDate,
                    payReceipt: changeImg
                }
                app.requestFn({ //提交
                    url: `/manage/bill/upload/${orderId}`,
                    header: 'application/x-www-form-urlencoded',
                    data: formData,
                    method: 'POST',
                    success: (res) => {
                        app.globalData.feeReach = true;
                        wx.showToast({ title: langData.affirmTip[lang] , icon: 'success', duration: 2000 });
                        _this.payPopFn();
                        setTimeout(() => {
                            _this.getFeeDetail(orderId);
                        }, 1500)
                    }
                });
            },
        })

    }

})