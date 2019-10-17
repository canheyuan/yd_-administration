
const app = getApp();
const commonFn = require('../../../utils/common.js'); //获取应用实例
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailData: null, //详情数据
        processPopHide:true,    //处理弹窗是否隐藏
        resultPopHide:true, //结果弹窗是否隐藏

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'complaint', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.getRepairDetail(options.id); //获取投诉信息
        });
        
    },

    //获取投诉详情
    getRepairDetail(id) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            url: `/manage/estateComplaint/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                detailData.applyTime = detailData.applyTime?commonFn.getDate(detailData.applyTime):'';
                detailData.processTime = detailData.processTime?commonFn.getDate(detailData.processTime):'';
                detailData.finishTime = detailData.finishTime?commonFn.getDate(detailData.finishTime):'';
                detailData.content = detailData.content ? detailData.content : langData.public.noDesTip[lang]
                switch (detailData.statusInt) {
                    case 1:
                        detailData.statusClass = '';
                        detailData.setFnName = 'setDisposeFn';
                        detailData.popName = 'processPopFn';
                        detailData.setBtnName = langData.btnName1[lang];
                        break;
                    case 2:
                        detailData.statusClass = 'follow';
                        detailData.setFnName = 'setFinishFn';
                        detailData.popName = 'resultPopFn';
                        detailData.setBtnName = langData.btnName2[lang];
                        break;
                    case 3:
                        detailData.statusClass = 'done';
                        break;
                }
                this.setData({ detailData: detailData })
            }
        });
    },

    //预览图片
    previewImg(e) {
        var index = e.currentTarget.dataset.index;
        var imgList = e.currentTarget.dataset.imgs;
        app.previewImgFn(imgList[index], imgList)
    },

    //打开、关闭受理弹窗
    processPopFn(){
        this.setData({ processPopHide: !this.data.processPopHide})
    },

    //打开、关闭结果弹窗
    resultPopFn() {
        this.setData({ resultPopHide: !this.data.resultPopHide })
    },

    //我要处理
    setDisposeFn(){
        var _this = this;
        var langData = this.data.langData;
        var lang = this.data.lang;
        var complaintId = this.data.detailData.complaintId; //投诉id
        app.requestFn({
            url: `/manage/estateComplaint/toProcess/${complaintId}`,
            method:"POST",
            success: (res) => {
                _this.processPopFn();
                wx.showToast({ title: langData.operateTip1[lang], icon: 'success', duration: 2000 });
                app.globalData.complaintReach = true;
                setTimeout(()=>{
                    _this.getRepairDetail(complaintId);
                },2000)
            }
        });
    },

    //处理完成
    setFinishFn(e){
        var _this = this;
        var langData = this.data.langData;
        var lang = this.data.lang;
        var complaintId = this.data.detailData.complaintId; //投诉id
        var resultStr = e.detail.value.des ? e.detail.value.des : langData.popDes2[lang];
        app.requestFn({
            url: `/manage/estateComplaint/complete/${complaintId}`,
            method: "POST",
            header:'application/x-www-form-urlencoded',
            data:{
                result:resultStr
            },
            success: (res) => {
                _this.resultPopFn();
                wx.showToast({ title: langData.operateTip2[lang], icon: 'success', duration: 2000 });
                app.globalData.complaintReach = true;
                setTimeout(() => {
                    _this.getRepairDetail(complaintId);
                }, 2000)
               
            }
        });
    }

})
