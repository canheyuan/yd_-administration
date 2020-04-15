
const app = getApp(); //获取应用实例
const Charts = require('../../../utils/wxcharts-min.js');
var chartsTimer = null;
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,

        monthTag: null,
        monthTagIndex: 1,
        incomeChartsData: null, //收入概况数据
        parkSummaryData: null, //园区数据
        unitSummaryData: null, //


        monthNum: 6, //收入概况月份数

        langData: null,
        lang: ''
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'analysis', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                monthTag: [
                    { title: res.month3[lang], num: 3 },
                    { title: res.month6[lang], num: 6 },
                    { title: res.aYear[lang], num: 12 },
                ]
            })
        });

        //默认加载
        this.reach();

    },

    reach() {
        //收入状态
        this.getIncomeSummary((res) => {
            this.incomeCharts(res);
        });

        this.getParkSummary();

        this.getUnitSummary((res) => {
            this.rentCharts(res);
            this.rentStatusCharts(res);
        });
    },

    //改变收入数据
    changeChartsFn(e) {
        var num = e.currentTarget.dataset.num;
        var index = e.currentTarget.dataset.index;
        this.setData({
            monthTagIndex: index,
            yearName: this.data.monthTag[index].title,
            monthNum: num
        })
        clearTimeout(chartsTimer);
        chartsTimer = setTimeout(() => {
            this.incomeCharts();
        }, 1000);
    },

    //收入概况
    incomeCharts() {
        var langData = this.data.langData;
        var lang = this.data.lang;
        var incomeChartsData = this.data.incomeChartsData;
        var maxNum = 100;
        if (!incomeChartsData) { return; }
        var categoriesList = Object.keys(incomeChartsData).reverse().slice(-this.data.monthNum);
        var categoriesData = categoriesList.map((item, index) => {
            if (maxNum < incomeChartsData[item]) { maxNum = incomeChartsData[item] };   //获取最大值
            return incomeChartsData[item];
        })
        console.log('categoriesList:', categoriesList, categoriesData)
        new Charts({
            canvasId: 'incomeCharts',
            background: '#1e699a',
            type: 'line',
            categories: categoriesList,
            series: [{
                name: langData.incomeMoney[lang],
                color: '#de7a80',
                pointColor: '#ffffff',
                data: categoriesData,
                format: function (val) {
                    return val;
                }
            }],
            yAxis: {
                title: langData.incomeMoney2[lang],
                fontColor: '#a6d0ec',
                titleFontColor: '#a6d0ec',
                gridColor: '#71a0bf',
                min: 0,
                max: maxNum,
                format: function (val) {
                    return val
                },
            },
            xAxis: {
                title: langData.monthText[lang],
                fontColor: '#a6d0ec',

                format: function (val) {
                    return val
                }
            },
            width: 375,
            height: 230,
            legend: false,

            extra: {
                legendTextColor: []
            }
        });
    },

    //出租比例
    rentCharts() {
        var unitSummaryData = this.data.unitSummaryData;

        var seriesList = unitSummaryData.map(item => {
            return {
                name: item.statusName,
                color: item.bgColor,
                data: item.count,
                format: function (val) {
                    return `${item.statusName}(${Math.ceil(val * 100)}%)`;
                }
            }
        })
        new Charts({
            canvasId: 'rentCharts',
            type: 'pie',
            series: seriesList,
            width: 375,
            height: 280,
            disablePieStroke: true,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                legendTextColor: []
            }
        });

    },

    //租赁状态图表生成
    rentStatusCharts(res) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        var unitSummaryData = this.data.unitSummaryData;
        var count1 = 0;
        var count2 = 0;
        unitSummaryData.forEach(item => {
            if (item.status == 3) {
                count1 += item.count - item.soon;
                count2 += item.soon
            } else {
                count1 += item.count;
            }
        });
        new Charts({
            canvasId: 'rentStatusCharts',
            type: 'pie',
            series: [{
                name: langData.rentStatus1[lang],
                color: '#bfd45e',
                data: count1,
                format: function (val) {
                    return `${langData.rentStatus1[lang]}(${val * 100}%)`
                }
            }, {
                name: langData.rentStatus2[lang],
                data: count2,
                color: '#b8a2db',
                format: function (val) {
                    return `${langData.rentStatus2[lang]}(${val * 100}%)`
                }
            }],
            width: 375,
            height: 280,
            disablePieStroke: true,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                legendTextColor: []
            }
        });
    },

    //获取收入状态数据
    getIncomeSummary(callback) {
        var langData = this.data.langData;
        app.requestFn({
            url: `/manage/parkDataAnalysis/incomeSummary`,
            success: (res) => {
                console.log('收入状态：', res.data)
                var detailData = res.data.data;
                this.setData({ incomeChartsData: detailData });
                callback && callback(detailData);
            }
        });
    },

    //获取园区总览数据
    getParkSummary(callback) {
        var langData = this.data.langData;
        app.requestFn({
            url: `/manage/parkDataAnalysis/parkSummary`,
            success: (res) => {
                console.log('园区总览：', res.data)
                var detailData = res.data.data;

                this.setData({ parkSummaryData: detailData });
                callback && callback(detailData);
            }
        });
    },

    //获取出租比例数据
    getUnitSummary(callback) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            url: `/manage/parkDataAnalysis/unitSummary`,
            success: (res) => {
                console.log('出租比例：', res.data)
                var detailData = res.data.data;
                detailData.forEach(item => {
                    switch (item.status) {
                        case 1:
                            item.statusName = langData.ratioStatus1[lang];
                            item.bgColor = '#00c7c9';
                            break;
                        case 2:
                            item.statusName = langData.ratioStatus2[lang];
                            item.bgColor = '#ffb884';
                            break;
                        case 3:
                            item.statusName = langData.ratioStatus3[lang];
                            item.bgColor = '#de7a80';
                            break;
                    }
                })
                this.setData({ unitSummaryData: detailData });

                callback && callback(detailData);
            }
        });
    },


    //下拉刷新
    onPullDownRefresh: function () {
        this.reach();
        wx.stopPullDownRefresh();
    },
})