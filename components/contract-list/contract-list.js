const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数

Component({
    //组件的属性列表
    properties: {
        targetPage: String,

        contractType: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ contractType: newVal });
            }
        },

        reachData: {
            type: Number,
            observer: function (newVal, oldVal, changedPath) {

                if (this.data.isFirst) {
                    var date1 = new Date;
                    date1 = date1.getTime();
                    app.loadLangFn(this, 'contract');
                    this.setData({
                        nowDate: date1,
                        isFirst: false
                    });
                }

                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal >= 1) {
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
        contractType: '',  //接口数据类型
        nowDate: '',  //当前时间戳

        isFirst: true,
        langData: null,
        lang: '',
        aaa:'asdfg'
    },

    //组件创建时执行
    attached() {
        //加载语言文字
        //app.loadLangFn(this, 'contract');
    },

    //组件的方法列表
    methods: {

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

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            var langData = _this.data.langData;
            var lang = _this.data.lang;
            //console.log(langData)
            listFn.listPage({
                url: '/manage/contract/list',
                data: {
                    type: _this.data.contractType  //类型，0所有 1待处理 2跟进中 3已完成，默认0
                },
                isReach: isReach,
                page: _this,
                listDataName: 'listInfo',
                getListDataFn: (listdata) => {
                    //返回列表数据和总数
                    return {
                        list: listdata.data,
                        total: listdata.total
                    }
                },
                disposeFn: (listItem) => {
                    //对列表循环操作改变数据
                    var listItem = listItem;
                    if (listItem) {
                        //计算到期天数
                        var strtime = listItem.contractEnd + ' 00:00:00';
                        var date = new Date(strtime.replace(/-/g, '/'));
                        var sjc_end = Date.parse(date);
                        listItem.endDay = parseInt((sjc_end - _this.data.nowDate) / 1000 / 3600 / 24);

                        if (listItem.endDay < 0) {
                            listItem.statusClass = 'epd';
                            listItem.statusText = langData.statusText3[lang];
                        } else if (listItem.endDay < 130) {
                            listItem.statusClass = 'warn';
                            listItem.statusText = listItem.endDay + langData.statusText2[lang];
                        } else {
                            listItem.statusClass = '';
                            listItem.statusText = langData.statusText1[lang];
                        }

                    }
                    return listItem;
                },
                success: () => {
                    console.log("合同列表:", _this.data.listInfo);
                }

            });
        },

    }
})
