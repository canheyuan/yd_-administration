//获取应用实例
const app = getApp()
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        loginInfo: null,
        detailsData: null, //详情数据
        detailsImgs: [], //详情图片地址数组
        progressDetails: true, //详细进度是否隐藏
        popIsShow: true, //服务价格一览表弹窗是否显示
        infoShow: true, //报修更多内容是否隐藏
        tipType: '', //提示弹窗类型remove、star
        tipPopShow: true,  //是否隐藏提示弹窗
        starScore: 0,  //评分分数
        repairId: '', //报修id
        servePop: false,  //服务价格一览表显示隐藏
        repairMoney: null,
        maintainersIndex: 0,
        maintainerPop: false, //维修人员弹窗

        imgPopHide: true,
        popImgUrl: '',

        langData: null,
        lang: ''
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'repair', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });

        this.setData({
            loginInfo: app.globalData.userInfo,
            repairId: options.id
        });  //存储报修id
        this.getRepairDetail(options.id); //获取报修详情
    },

    //获取报修详情
    getRepairDetail(repairId) {
        app.requestFn({
            url: `/manage/estateRepair/detail/${repairId}`,
            success: (res) => {
                var detailsData = res.data.data;
                if (!!detailsData.maintainers) {
                    detailsData.maintainers.forEach(item => {
                        item.title = `${item.userName}  (${item.phonenumber})`;
                    });
                }
                switch (detailsData.status) {
                    case 1:
                        detailsData.statusClass = '';
                        break;
                    case 2:
                        detailsData.statusClass = 'follow';
                        break;
                    case 3:
                        detailsData.statusClass = 'discuss';
                        break;
                    case 4:
                        detailsData.statusClass = 'done';
                        break;
                }
                this.setData({
                    detailsData: detailsData,
                    detailsImgs: detailsData.images ? detailsData.images.split(',') : [],
                })
                console.log("报修详情：", detailsData)
            }
        });
    },

    //设置跟进
    setFollow() {
        var _this = this;
        app.requestFn({
            url: `/manage/estateRepair/follow/${_this.data.repairId}`,
            method: 'POST',
            success: (res) => {
                _this.getRepairDetail(_this.data.repairId);
                app.globalData.repairReach = true;
            }
        });
    },

    //设置完成
    setComplete() {
        var _this = this
        app.requestFn({
            url: `/manage/estateRepair/complete`,
            header: 'application/x-www-form-urlencoded',
            data: {
                repairId: _this.data.repairId,
                repairMoney: _this.data.repairMoney,
            },
            method: 'POST',
            success: (res) => {
                _this.getRepairDetail(_this.data.repairId);
                _this.servePopFn();
                app.globalData.repairReach = true;
            }
        });
    },

    //输入报修费用文本框失去焦点时执行
    changeInput(e) {
        var money = e.detail.value;
        this.setData({ repairMoney: money })
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
    },

    //弹出维修人员弹窗
    maintainerPopShow() {
        this.setData({
            maintainerPop: !this.data.maintainerPop
        })
    },

    //选择分配维修人员
    chooseMaintainersFn(e) {
        var _this = this;
        var loginName = _this.data.detailsData.maintainers[e.detail.value].loginName;
        app.requestFn({
            url: `/manage/estateRepair/appoint`,
            header: 'application/x-www-form-urlencoded',
            data: {
                "repairId": _this.data.detailsData.repairId,
                "handler": loginName,
                "remark": ""
            },
            method: 'POST',
            success: (res) => {
                
                wx.showToast({ title: _this.data.langData.assignTip[_this.data.lang], icon: 'success', duration: 2000 });
                _this.maintainerPopShow();
                app.globalData.indexReach = true
                setTimeout(() => {
                    _this.getRepairDetail(_this.data.detailsData.repairId);
                }, 1000);
            }
        });
    },

    //图片放大
    bigImgFn(e) {
        var imgUrl = e.currentTarget.dataset.big_img;
        app.previewImgFn(imgUrl, [imgUrl])
       
        // this.setData({
        //     imgPopHide: !this.data.imgPopHide,
        //     popImgUrl: imgUrl
        // });
    },

    //关闭弹窗
    closeImgPop() {
        this.setData({
            imgPopHide: !this.data.imgPopHide
        });
    }

})
