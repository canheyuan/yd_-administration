const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数
Component({
    //组件的属性列表
    properties: {
        targetPage: String, //来源
        repairType: {   //报修类型
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ repairType: newVal });
            }
        },
        reachData: {    //刷新状态
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

    //组件的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        listInfo: {},   //列表数据
        repairType: '',  //接口数据类型

        langData: null,
        lang: ''
    },

    //组件加载完成后
    attached() {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'repair');
    },

    //组件的方法列表
    methods: {

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            listFn.listPage({
                url: '/manage/estateRepair/list',
                data: {
                    type: _this.data.repairType  //类型，0所有 1待处理 2跟进中 3已完成，默认0
                },
                isReach: isReach,
                page: _this,
                listDataName: 'listInfo',
                getListDataFn: (listdata) => {
                    return {  //返回列表数据和总数
                        list: listdata.data,
                        total: listdata.total
                    }
                },
                disposeFn: (listItem) => {
                    //对列表循环操作改变数据
                    var listItem = listItem;
                    if (listItem) {
                        switch (listItem.status) {
                            case 1:
                                listItem.statusClass = '';
                                break;
                            case 2:
                                listItem.statusClass = 'follow';
                                break;
                            case 3:
                                listItem.statusClass = 'discuss';
                                break;
                            case 4:
                                listItem.statusClass = 'done';
                                break;
                        }
                    }
                    return listItem;
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
        }

    }
})
