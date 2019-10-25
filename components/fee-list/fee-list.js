const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数

Component({
    //组件的属性列表
    properties: {
        targetPage: String,

        orderType: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ orderType: newVal });
            }
        },

        month:{
            type: String,
        },

        reachData: {
            type: Number, //类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {

                if (this.data.isFirst) {
                    //加载语言文字
                    app.loadLangFn(this, 'fee');
                    this.setData({ isFirst: false });
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
        orderType: '',  //接口数据类型
        nowDate: '',  //当前时间戳

        isFirst: true,
        langData: null,
        lang: ''
    },

    //组件加载完成后
    attached() {

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
                url: '/manage/bill/list',
                data: {
                    period: _this.properties.month,     //收费周期 yyyy-MM
                    type: _this.properties.orderType   //类型，0所有 1待缴费 2已缴费 3待审核，默认3
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
                        listItem.month = listItem.feePeriod.substring(5, 7);
                        //状态status: 0异常 1未审核 2未缴费 3已缴费 4已开票 5支付中 6退款 9已取消
                        switch (listItem.status) {
                            case 0:
                                listItem.statusName = langData.statusName0[lang];
                                listItem.statusClass = '';
                                break;
                            case 1:
                                listItem.statusName = langData.statusName1[lang];
                                listItem.statusClass = '';
                                break;
                            case 2:
                                listItem.statusName = langData.statusName2[lang];
                                listItem.statusClass = 'blue';
                                break;
                            case 3:
                                listItem.statusName = langData.statusName3[lang];
                                listItem.statusClass = 'green';
                                break;
                            case 4:
                                listItem.statusName = langData.statusName4[lang];
                                listItem.statusClass = 'done';
                                break;
                            case 5:
                                listItem.statusName = langData.statusName5[lang];
                                listItem.statusClass = '';
                                break;
                            case 6:
                                listItem.statusName = langData.statusName6[lang];
                                listItem.statusClass = '';
                                break;
                            case 9:
                                listItem.statusName = langData.statusName9[lang];
                                listItem.statusClass = '';
                                break;
                        }
                    }
                    return listItem;
                },
                success: () => {
                    console.log("待缴查询列表:", _this.data.listInfo);
                }

            });
        },

    }
})
