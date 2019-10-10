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

    //生命周期函数--监听页面加载/
    onLoad: function (options) {
        app.loadLangFn(this, 'degrees', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.getDegreesDetail(options.id);
        });
        
    },

    //获取报修详情
    getDegreesDetail(id) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        var _this = this;
        app.requestFn({
            url: `/manage/sharedMeterage/detail/${id}`,
            success: (res) => {
                console.log("水电详情接口：", res.data.data);
                var datas = res.data.data;
                if (datas.feeType == 'water') { datas.feeTypeName = langData.waterName[lang]; }
                if (datas.feeType == 'electric') { datas.feeTypeName = langData.ammeterName[lang]; }
                datas.isPopHide = true;
                datas.previousTime = datas.previousTime ? commonFn.getDate(datas.previousTime).substring(0, 7) : null;
                datas.currentTime = datas.currentTime ? commonFn.getDate(datas.currentTime) : null;
                datas.previousCount = datas.previousReading ? (datas.currentReading - datas.previousReading) : null;
                _this.setData({ detailsData: datas });
            }
        });

    },

    //保存提交
    submitFn(e) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        var _this = this
        var tipName = e.currentTarget.dataset.name;
        var datas = _this.data.detailsData;
        var submitDatas = {
            'id': datas.id,
            'currentReading': datas.currentReading ? datas.currentReading : '',
            'count': datas.count ? datas.count : '',
            'meterPicture': datas.meterPicture ? datas.meterPicture : '',
            'remark': datas.remark ? datas.remark : '',
        };

        console.log('提交的数据：', submitDatas);

        //判断是否未录表数据
        if (!submitDatas.currentReading || !submitDatas.count) {
            wx.showToast({ title: langData.noEnteringCountTip[lang], icon: 'none', duration: 3000 });
            return;
        }

        app.requestFn({
            url: `/manage/sharedMeterage/record`,
            header: 'application/x-www-form-urlencoded',
            data: submitDatas,
            method: 'POST',
            success: (res) => {
                wx.showToast({ title: tipName + angData.successTip[lang], icon: 'none', duration: 2000 });
            }
        });
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        console.log("图片失败：", e)
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

    //选择上传图片
    fileImageFn(e) {
        var _this = this;
        var obj = e.currentTarget.dataset.obj;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    //url: app.globalData.jkUrl + '/manage/uploadImage', //仅为示例，非真实的接口地址
                    url: app.globalData.jkUrl + '/manage/uploadImage', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    header: {
                        '5ipark-sid': app.globalData.sessionId
                    },
                    formData: {
                        'entityId': '',
                        'entityType': 'estatemeter',
                        'appCode': ''
                    },
                    success(res) {
                        var datas = JSON.parse(res.data);
                        if (datas.code == 0) {
                            const changeImg = datas.data.filePath;
                            const changeImg2 = datas.data.urlPath;
                            _this.setData({ [obj]: changeImg2 });
                        }

                    }, fail(err) {
                        console.log(err);
                    }
                });
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

        if (objType == 'currentReading' && parent.previousReading) {
            value2 = value - parent.previousReading;
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
        this.setData({ [obj]: !this.data.detailsData.isPopHide });
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