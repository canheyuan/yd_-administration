const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数

Component({

    properties: {
        targetPage: String,

        reachData: {    
            type: Number,
            observer: function (newVal, oldVal, changedPath) {
                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        }
    },

    data: {
        domainUrl: app.globalData.domainUrl,    //图片地址前缀
        listInfo:{},

        langData: null,  //语言数据
        lang:''
    },

    //组件加载完成后
    attached() {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'cpBacklog');
    },

    methods: {
        //获取列表数据
        getListInfo(isReach) {
            var langData = this.data.langData;
            var lang = this.data.lang;
            var _this = this;
            listFn.listPage({
                url: `/manage/userBacklog/list`,
                isReach: isReach,
                page: _this,
                listDataName: 'listInfo',
                getListDataFn: (listdata) => {
                    //返回列表数据和总数
                    return {
                        list: listdata.data.rows,
                        total: listdata.data.total
                    }
                },
                disposeFn: (listItem) => {
                    //对列表循环操作改变数据
                    var listItem = listItem;
                    if (listItem) {
                        listItem.time = listItem.updateTime.substr(11, 5);
                        listItem.date = listItem.updateTime.substr(5, 5);
                        switch (listItem.entityType){
                            case 'estaterepair':    //报修
                                listItem.className = 'li_yellow';
                                listItem.labelName = langData.repairText[lang];
                                listItem.goUrl = '/pages/repair/repair-detail/repair-detail?id=' + listItem.entityId
                                break;
                            case 'financebill': //订单
                                listItem.className = 'li_blue';
                                listItem.labelName = langData.billText[lang];
                                listItem.goUrl = '/pages/fee-check/fee-detail/fee-detail?id=' + listItem.entityId
                                break;
                            case 'estaterentdetail':    //物资
                                listItem.className = 'li_green';
                                listItem.labelName = langData.goodsText[lang];
                                listItem.goUrl = '/pages/supplies/supplies-detail/supplies-detail?id=' + listItem.entityId
                                break;
                            case 'estatedecorationbooking': //装修
                                listItem.className = 'li_purple';
                                listItem.labelName = langData.fixturesText[lang];
                                listItem.goUrl = '';
                                break;
                            case 'chamberorder':    //场地预定
                                listItem.className = 'li_purple';
                                listItem.labelName = langData.billText[lang];
                                listItem.goUrl = '/pages/venue/venue-booking-details/venue-booking-details?id=' + listItem.entityId
                                break;
                        }
                    }
                    return listItem;
                },
                success: (res) => {
                    console.log("待办事项列表：", _this.data.listInfo);
                }
            });
        },

        //上拉到底部加载更多函数
        loadMoreListFn: function () {
            var _this = this;
            var listInfo = this.data.listInfo;
            listFn.listLoadMore({
                pageNum: listInfo.pageNum,
                pageSize: listInfo.pageSize,
                pageTotal: listInfo.pageTotal,
                getListFn: (isReach) => {
                    _this.getListInfo(isReach);
                }
            })
        },

        //跳转代办事项
        goToBackLog(e) {
            var langData = this.data.langData;
            var lang = this.data.lang;
            var goUrl = e.currentTarget.dataset.url;
            if (!goUrl) {
                wx.showToast({ title: langData.buildTip[lang], icon: 'none', duration: 2000 });
            } else {
                wx.navigateTo({ url: goUrl });
            }

        }
    }
})
