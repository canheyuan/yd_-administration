
var commonFn = require('../../../utils/common.js'); //一些通用的函数
var WxParse = require('../../../wxParse/wxParse.js');

const app = getApp()
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        noticeData: null,  //数据
    },

    onLoad: function (options) {
        this.getNoticeInfo(options.id);
    },
    //获取消息详情信息
    getNoticeInfo(noticeId) {
        var _this = this;
        app.requestFn({
            url: `/manage/noticeInfo/detail/${noticeId}`,
            success: (res) => {
                var noticeData = res.data.data;
                wx.setNavigationBarTitle({ title: noticeData.title });    //设置标题
                //data.createTime = commonFn.getDate(data.createTime);
                noticeData.content = commonFn.replaceTxt(noticeData.content);  //替换<o:p>等标签
                WxParse.wxParse('content', 'html', noticeData.content, _this, 0);
                this.setData({ noticeData: noticeData });
            }
        });
    }

})