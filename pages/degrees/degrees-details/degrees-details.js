const commonFn = require('../../../utils/common.js');
const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null, //详情页数据

        ammeterList: null,
        waterList: null,
        gasList: null,

        imgPopHide: true,
        popImgUrl: '',

        langData: null,
        lang: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.loadLangFn(this, 'degrees', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });
        this.getDegreesDetail(options.id);
        //this.getDegreesDetail('b49bdb08768b4383f043edbe4eacb29b');  //未抄表
    },

    //获取报修详情
    getDegreesDetail(id) {
        var _this = this;
        app.requestFn({
            url: `/manage/estateMeter/detail/${id}`,
            success: (res) => {
                console.log("水电详情接口：", res.data.data);
                var datas = res.data.data;
                datas.feePeriod = datas.feePeriod.substring(5, 7);
                var ammeterList = [];
                var waterList = [];
                var gasList = [];
                datas.isCharged = true;
                //获取本月水电费数据
                for (var i = 0; i < datas.meters.length; i++) {
                    datas.isCharged = (datas.isCharged && datas.meters[i].isCharged) ? true : false;
                    if (datas.meters[i].type == 'electric') {
                        ammeterList.push({
                            month: datas.meters[i],
                            isPopHide: true
                        });
                    } else if (datas.meters[i].type == 'water') {
                        waterList.push({
                            month: datas.meters[i],
                            isPopHide: true
                        });
                    } else if (datas.meters[i].type == 'other') {
                        gasList.push({
                            month: datas.meters[i],
                            isPopHide: true
                        });
                    }
                }
                //获取上月电费数据
                ammeterList.forEach(item => {
                    datas.previousMeters.forEach(item2 => {
                        if (item.month.meterId == item2.meterId) {
                            item.prevMonth = item2;
                        }
                    });
                });
                //获取上月水费数据
                waterList.forEach(item => {
                    datas.previousMeters.forEach(item2 => {
                        if (item.month.meterId == item2.meterId) {
                            item.prevMonth = item2;
                        }
                    });
                });

                //获取上月其他（煤气费）数据
                gasList.forEach(item => {
                    datas.previousMeters.forEach(item2 => {
                        if (item.month.meterId == item2.meterId) {
                            item.prevMonth = item2;
                        }
                    });
                });

                _this.setData({
                    detailsData: datas,
                    ammeterList: ammeterList,  //电费列表
                    waterList: waterList, //水费列表
                    gasList: gasList //其他费用列表
                });
            }
        });

    },

    //保存提交
    submitFn(e) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        var _this = this
        var tipName = e.currentTarget.dataset.name;
        var submitDatas = { id: _this.data.detailsData.id, meters: [] };
        var ammeterList = _this.data.ammeterList;
        var waterList = _this.data.waterList;
        var gasList = _this.data.gasList;
        var countTipArr = [];

        ammeterList.forEach(item => {
            if (item.month.isCharged != 1) {
                var count = item.month.count ? item.month.count : ((item.prevMonth && item.prevMonth.currentReading && item.month.currentReading) ? (item.month.currentReading - item.prevMonth.currentReading) : ''); //用量
                if (count < 0 || !count) {
                    if (count) {
                        countTipArr.push(langData.curMonthTip[lang] + item.month.meterName + langData.countTip[lang]);
                    }
                    return;
                }
                submitDatas.meters.push({
                    "meterId": item.month.meterId, //
                    "remark": item.month.remark, //备注
                    "currentReading": item.month.currentReading, //本次抄表读数
                    "count": count,
                    "meterPicture": item.month.meterPicture ? item.month.meterPicture : '' //读数照片
                });
            }
        });

        waterList.forEach(item => {
            if (item.month.isCharged != 1) {
                var count = item.month.count ? item.month.count : ((item.prevMonth && item.prevMonth.currentReading && item.month.currentReading) ? (item.month.currentReading - item.prevMonth.currentReading) : ''); //用量
                if (count < 0 || !count) {
                    if (count) {
                        countTipArr.push(langData.curMonthTip[lang] + item.month.meterName + langData.countTip[lang]);
                    }
                    return;
                }
                submitDatas.meters.push({
                    "meterId": item.month.meterId, //
                    "remark": item.month.remark, //备注
                    "currentReading": item.month.currentReading, //本次抄表读数
                    "count": count,
                    "meterPicture": item.month.meterPicture ? item.month.meterPicture : '' //读数照片
                });
            }
        });

        gasList.forEach(item => {
            if (item.month.isCharged != 1) {
                var count = item.month.count ? item.month.count : ((item.prevMonth && item.prevMonth.currentReading && item.month.currentReading) ? (item.month.currentReading - item.prevMonth.currentReading) : ''); //用量
                if (count < 0 || !count) {
                    if (count) {
                        countTipArr.push(langData.curMonthTip[lang] + item.month.meterName + langData.countTip[lang]);
                    }
                    return;
                }
                submitDatas.meters.push({
                    "meterId": item.month.meterId, //
                    "remark": item.month.remark, //备注
                    "currentReading": item.month.currentReading, //本次抄表读数
                    "count": count,
                    "meterPicture": item.month.meterPicture ? item.month.meterPicture : '' //读数照片
                });
            }
        });

        console.log("提交的数据：", submitDatas);
        //判断录的数据是否有问题
        if (countTipArr.length > 0) {
            wx.showToast({ title: countTipArr[0], icon: 'none', duration: 3000 });
            return;
        }
        //判断是否未录表数据
        if (submitDatas.meters.length == 0) {
            wx.showToast({ title: langData.noEnteringCountTip[lang], icon: 'none', duration: 3000 });
            return; 2
        }


        app.requestFn({
            url: `/manage/estateMeter/record`,
            data: submitDatas,
            method: 'POST',
            success: (res) => {
                wx.showToast({ title: tipName + langData.successTip[lang], icon: 'success', duration: 2000 });
            }
        });
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        console.log("图片失败：", e)
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

    //上传图片
    fileImageFn(e) {
        var _this = this;
        var obj = e.currentTarget.dataset.obj;
        app.chooseImg({
            success: (res) => {
                var tempFilePaths = res.tempFilePaths;
                app.uploadFile({
                    imgUrl: tempFilePaths[0],
                    entityType: 'estatemeter',
                    success: (res) => {
                        var changeImg = res.filePath;
                        var changeImg2 = res.urlPath;
                        _this.setData({ [obj]: changeImg2 });
                    }
                })
            }
        })
    },

    //删除预览图
    removeImageFn(e) {
        var obj = e.currentTarget.dataset.obj;
        this.setData({ [obj]: null });
    },

    //文本框输入时
    inputChangeFn(e) {
        var obj = e.currentTarget.dataset.obj;
        var objType = e.currentTarget.dataset.type;
        var parent = e.currentTarget.dataset.parent;

        var obj2 = e.currentTarget.dataset.obj2;
        var value = e.detail.value;
        var value2;

        if (objType == 'currentReading' && parent.prevMonth && parent.prevMonth.currentReading) {
            value2 = value - parent.prevMonth.currentReading;
            this.setData({
                [obj]: value,
                [obj2]: value2.toFixed(2)
            });
        } else {
            this.setData({ [obj]: value });
        }

    },

    //清除文本框
    clearInputFn(e) {

        var obj = e.currentTarget.dataset.obj;
        console.log('清除', obj, this.data.ammeterList);
        this.setData({ [obj]: '' });
    },

    //打开更多内容
    moreBtnFn(e) {
        console.log(e.currentTarget.dataset);
        var obj = e.currentTarget.dataset.obj;
        var index = e.currentTarget.dataset.index;
        var type2 = e.currentTarget.dataset.type;
        if (type2 == 'ammeter') {
            this.setData({ [obj]: !this.data.ammeterList[index].isPopHide });
        } else if (type2 == 'water') {
            this.setData({ [obj]: !this.data.waterList[index].isPopHide });
        } else if (type2 == 'other') {
            this.setData({ [obj]: !this.data.gasList[index].isPopHide });
        }
    },

    //备注输入
    textareaFn(e) {
        console.log('备注：', e);
        var obj = e.currentTarget.dataset.obj;
        this.setData({ [obj]: e.detail.value });
    },

    //图片放大
    bigImgFn(e) {
        var imgUrl = e.currentTarget.dataset.big_img;
        wx.previewImage({
            urls: [imgUrl],
            current: imgUrl,
        });
    },

    //关闭弹窗
    closeImgPop() {
        this.setData({
            imgPopHide: !this.data.imgPopHide
        });
    }

})