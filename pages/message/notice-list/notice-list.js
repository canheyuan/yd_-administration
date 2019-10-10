var commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数

const app = getApp();  //获取应用实例
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        listInfo: {},   //列表数据
        langData:null,
        lang:''
    },


    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'message', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.noticeTitle[lang] });  //设置当前页面的title
        });
        this.getListInfo(true);  //加载完页面加载记录列表
        
    },


    //获取列表数据
    getListInfo(isReach) {
        var langData = this.data.langData;
        var _this = this;
        listFn.listPage({
            url: `/manage/noticeInfo/list`,
            isReach: isReach,
            page: _this,
            listDataName: 'listInfo',
            getListDataFn: (listdata) => {
                return {    //返回列表数据和总数
                    list: listdata.data.rows,
                    total: listdata.data.total
                }
            },
            disposeFn: (listItem) => {
                //对列表循环操作改变数据
                var listItem = listItem;
                if (listItem) {
                    listItem.publishTime = listItem.publishTime ? listItem.publishTime.substring(5, 16) : '--';
                }
                return listItem;
            }
        });
    },

    //上拉到底部加载更多函数
    onReachBottom: function () {
        var _this = this;
        var listInfo = this.data.listInfo;
        listFn.listLoadMore({
            pageNum: listInfo.pageNum,
            pageSize: listInfo.pageSize,
            pageTotal: listInfo.pageTotal,
            getListFn: (isReach) => {
                _this.getListInfo(isReach);
            }
        });
    },

    //跳转到详情
    gotoDetailFn(e) {
        var item = e.currentTarget.dataset.item;
        var index = e.currentTarget.dataset.index;
        item.isUnread = 'N';
        this.setData({
            ['listInfo.list[' + index + ']']: item
        })
        wx.navigateTo({
            url: `/pages/message/notice-details/notice-details?id=${item.noticeId}`,
        })
    }

})