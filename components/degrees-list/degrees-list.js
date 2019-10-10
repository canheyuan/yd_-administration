const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数
const commonFn = require('../../utils/common.js');

Component({
    //组件的属性列表
    properties: {
        targetPage: String, //来源
        degreesType: {  //状态（未抄表、已抄表）
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ degreesType: newVal });
            }
        },
        listType: { //列表类型（企业或公摊）
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行

            }
        },
        dateMonth: String,  //选择月份
        floorId: String,  //选择月份
        buildingId: String,  //选择月份

        reachData: {
            type: Number, //类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {

                if (this.data.isFirst) {
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
        contractType: '',  //接口数据类型
        nowDate: '',  //当前时间戳

        isFirst: true,
    },

    //组件加载完成后
    attached() {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'degrees');
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
            var langData = this.data.langData;
            var lang = this.data.lang;
            var listType = _this.properties.listType;
            var formData = {
                period: _this.properties.dateMonth   //日期
            };
            var apiUrl = '';
            switch (listType) {
                case 'company': //企业
                    apiUrl = '/manage/estateMeter/list';
                    formData['type'] = _this.properties.degreesType;  //类型，0所有 1未抄表 2已抄表，默认1
                    formData['buildingId'] = _this.properties.buildingId;
                    formData['floorId'] = _this.properties.floorId;
                    break;
                case 'share': //公摊
                    apiUrl = '/manage/sharedMeterage/list';
                    formData['isMetered'] = _this.properties.degreesType; //类型，N未抄表 Y已抄表，默认N
                    break;
            }

            listFn.listPage({
                url: apiUrl,
                data: formData,
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

                        switch (listType) {
                            case 'company':
                                //处理录入时间
                                var dateTime = 0;
                                listItem.meters.forEach(function (item02, j) {
                                    var date = new Date(item02.currentTime);
                                    var data_sjc = Date.parse(date);
                                    dateTime = dateTime > data_sjc ? dateTime : data_sjc;
                                });
                                listItem.dateTime = dateTime ? commonFn.getDate(dateTime) : null;
                                listItem.feePeriod = listItem.feePeriod.substring(5, 7);  //处理月份
                                listItem.gotoUrl = `/pages/degrees/degrees-details/degrees-details?id=${listItem.id}`;
                                listItem.statusName = _this.properties.degreesType == 1 ? langData.statusName1[lang] : langData.statusName2[lang];
                                break;
                            case 'share':
                                listItem.dateTime = listItem.currentTime ? commonFn.getDate(listItem.currentTime) : null;
                                listItem.entName = listItem.meterName;
                                listItem.feeNames = listItem.meterName;
                                listItem.feePeriod = listItem.feePeriod.substring(5, 7);  //处理月份
                                listItem.gotoUrl = `/pages/degrees/degrees-details2/degrees-details2?id=${listItem.id}`;
                                listItem.statusName = _this.properties.degreesType == 'N' ? langData.statusName1[lang] : langData.statusName2[lang];
                                break;
                        }
                    }
                    return listItem;
                },
                success: () => {
                    //console.log("水电度数列表:", _this.data.listInfo);
                }

            });
        },

    }
})
