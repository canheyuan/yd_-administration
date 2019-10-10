
const app = getApp()  //获取应用实例
var commonFn = require('../../../utils/common.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null, //详情数据

        isPopHide: true, //确认弹窗是否隐藏
        popTipTitle: '',  //弹窗提示内容
        operation: '', //操作类型

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'supplies', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.borrowTitle[lang] });  //设置当前页面的title
        });

        this.getDetail(options.id); //获取报修详情
    },

    //获取物资详情
    getDetail(id) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            url: `/manage/estateRentDetail/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                switch (detailData.status) {
                    case 1:
                        detailData.statusName = langData.borrowStatus1[lang];
                        detailData.statusClass = 'follow';
                        break;
                    case 2:
                        detailData.statusName = langData.borrowStatus2[lang];
                        detailData.statusClass = '';
                        break;
                    case 3:
                        detailData.statusName = langData.borrowStatus2[lang];
                        detailData.statusClass = '';
                        break;
                    case 4:
                        detailData.statusName = langData.borrowStatus4[lang];
                        detailData.statusClass = 'done';
                        break;
                    case 5:
                        detailData.statusName = langData.borrowStatus5[lang];
                        detailData.statusClass = 'done';
                        break;
                }
                detailData.applyTime = commonFn.getDate(detailData.applyTime);
                this.setData({ detailsData: detailData });
                console.log('物资详情数据：', detailData);
            }
        });
    },

    //打开确认弹窗
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

    //点击确认按钮
    affirmFn(e) {
        var operation = this.data.operation;
        if (operation == 'agree') {
            this.setFollow(2);  //同意借出去
        } else if (operation == 'reject') {
            this.setFollow(5) //拒绝借出
        } else if (operation == 'giveback') {
            this.setComplete(); //确认归还
        }
    },

    //确认借出
    setFollow(czType) {
        var _this = this;
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            url: `/manage/estateRentDetail/approve`,
            data: {
                "remark": "",
                "rentId": _this.data.detailsData.rentId,
                "status": czType
            },
            method: 'POST',
            success: (res) => {
                var tipTxt = (czType == 2) ? langData.successTip[lang] : langData.rejectTip[lang];
                wx.showToast({ title: tipTxt, icon: 'success', duration: 3000 });
                _this.cancelFn();
                setTimeout(() => {
                    _this.getDetail(_this.data.detailsData.rentId);
                }, 1000);
            }
        });

    },

    //确认归还
    setComplete() {
        var _this = this;
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            url: `/manage/estateRentDetail/return`,
            data: {
                "remark": "", //备注
                "rentId": _this.data.detailsData.rentId,
                "returnCount": 1
            },
            method: 'POST',
            success: (res) => {
                wx.showToast({ title: langData.returnSuccessTip[lang], icon: 'success', duration: 3000 });
                app.globalData.indexReach = true;
                _this.cancelFn();
                setTimeout(() => {
                    _this.getDetail(_this.data.detailsData.rentId);
                }, 1000);
            }
        });
    },

    //输入报修费用文本框失去焦点时执行
    blurInput(e) {
        var data = e.detail.value;
        this.setData({ repairMoney: data });
    },

    //服务完成弹窗开关
    servePopFn() {
        this.setData({
            servePop: !this.data.servePop
        })
    },

    //打开关闭服务价格一览表弹窗
    popFn() {
        this.setData({
            popIsShow: !this.data.popIsShow
        })
    }

})
