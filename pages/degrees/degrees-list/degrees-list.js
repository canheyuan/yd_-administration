const commonFn = require('../../../utils/common.js');
const app = getApp(); //获取应用实例
Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        nowMonth: "",  //本月

        typeStatus: '1',
        selectHide: true,  //下来框是否隐藏
        selectTagIndex: 0, //下拉框当前索引
        tagIndex: 0,  //选项卡当前索引

        buildFloorData: null,  //全部楼宇信息
        buildFloorList: [],
        buildFloorIndex: [0, 0],

        selectTag: null,

        langData:null,
        lang:''

    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'degrees', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                selectTag: [
                    {
                        value: res.selectName1[lang],
                        type: 'company',
                        bindName: 'getDegreesList',//点击事件名称
                        tagList: [{ 
                            name: res.tagName1[lang], 
                            buildFloorName: res.chooseFloor[lang],
                            type: 1, dateMonth: '', buildingId: '', floorId: '', show:true, reach: 1
                            },
                        { 
                            name:res.tagName2[lang],
                            buildFloorName: res.chooseFloor[lang],
                            type: 2, dateMonth: '', buildingId: '', floorId: '', show: false, reach: 1
                        }]
                    },
                    {
                        value: res.selectName2[lang],
                        type: 'public',
                        bindName: 'getDegreesList2', //点击事件名称
                        tagList: [
                            { name: res.tagName1[lang], type: 'N', dateMonth: '', show: false, reach: 1 },
                            { name: res.tagName2[lang], type: 'Y', dateMonth: '', show: false, reach: 1 }
                        ]
                    }
                ]
            })
        });


        var date = new Date;
        date = date.getTime();
        var month = commonFn.getDate(date).substring(0, 7); //本月
        this.setData({ nowMonth: month });

        this.getBuildingList();
    },

    onShow(){

    },

    //下拉刷新
    onPullDownRefresh: function (e) {
        var reachObj = 'selectTag[' + this.data.selectTagIndex + '].tagList[' + this.data.tagIndex + '].reach';
        this.setData({
            [reachObj]: Math.random()+1
        });
        wx.stopPullDownRefresh();
    },

    //获取楼宇列表信息
    getBuildingList() {
        var _this = this;
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            url: `/manage/realtyBuilding/fullList`,
            isLoading: false,
            success: (res) => {
                var buildFloorData = res.data.data;
                var allItem = {
                    buildingId: '',
                    buildingName: langData.allFloor[lang],
                    floorList: []
                }
                buildFloorData.unshift(allItem);
                buildFloorData.forEach(item => {
                    item.floorList = item.floorList ? item.floorList : [];
                    item.floorList.unshift({
                        floorId: '',
                        floorName: langData.allFloor[lang],
                    })
                });

                var buildFloorList = [];
                buildFloorList[0] = buildFloorData.map(item => {
                    return item.buildingName;
                })
                buildFloorList[1] = buildFloorData[0].floorList.map(item => {
                    return item.floorName;
                });

                _this.setData({
                    buildFloorData: buildFloorData,
                    buildFloorList: buildFloorList
                });
            }
        });
    },

    //改变picker的value时触发
    getBuildFloorColumnFn(e) {
        var _this = this;
        var column = e.detail.column;
        var valueIndex = e.detail.value;
        var buildFloorIndex = this.data.buildFloorIndex;
        if (column == 0) {
            var floorNameList = this.data.buildFloorData[valueIndex].floorList.map(item => {
                return item.floorName;
            });
            buildFloorIndex = [valueIndex, 0];
            this.setData({
                ['buildFloorList[1]']: floorNameList,
                buildFloorIndex: buildFloorIndex
            })
        } else {
            buildFloorIndex[1] = valueIndex;
            this.setData({
                buildFloorIndex: buildFloorIndex
            })
        }
    },

    //筛选楼宇，改变picker值时触发并刷新列表
    getBuildFloorValFn(e) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        var tagItem = 'selectTag[' + this.data.selectTagIndex + '].tagList[' + this.data.tagIndex + '].'
        var reachObj = tagItem + 'reach';
        var floorObj = tagItem + 'floorId';
        var buildObj = tagItem + 'buildingId';
        var nameObj = tagItem + 'buildFloorName';
        var valueArr = e.detail.value;  //value的值是一个数组[0,1]
        var buildItem = this.data.buildFloorData[valueArr[0]];

        var buildName = buildItem.buildingName;
        var floorName = buildItem.floorList[valueArr[1]].floorName;
        var buildFloorName = ''
        if (valueArr[0] == 0) {
            buildFloorName = langData.public.all[lang];
        } else if (valueArr[1] == 0) {
            buildFloorName = buildName;
        } else {
            buildFloorName = buildName + floorName;
        }

        this.setData({
            [buildObj]: buildItem.buildingId,
            [floorObj]: buildItem.floorList[valueArr[1]].floorId,
            [nameObj]: buildFloorName,
            [reachObj]: Math.random() + 1
        })
    },

    //改变下拉框内容
    selectChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        var obj = 'selectTag[' + index + '].tagList[' + this.data.tagIndex + '].show'
        this.setData({
            [obj]:true,
            selectTagIndex: index,
            selectHide: !this.data.selectHide
        });
    },

    //选项卡切换
    tagChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        var obj = 'selectTag[' + this.data.selectTagIndex + '].tagList[' + index + '].show'
        this.setData({ 
            [obj]: true,
            tagIndex: index 
        });
    },

    //关闭打开下拉列表
    selectHideFn(e) {
        this.setData({ selectHide: !this.data.selectHide });
    },

    //切换月份
    changeMonthFn(e) {
        var dateMonthObj = 'selectTag[' + this.data.selectTagIndex + '].tagList[' + this.data.tagIndex + '].dateMonth';
        var reachObj = 'selectTag[' + this.data.selectTagIndex + '].tagList[' + this.data.tagIndex + '].reach';
        this.setData({
            [dateMonthObj]: e.detail.value,
            [reachObj]: Math.random() + 1
        });
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {

        var reachObj = 'selectTag[' + this.data.selectTagIndex + '].tagList[' + this.data.tagIndex + '].reach';
        this.setData({ [reachObj]: Math.random() });

    }
})