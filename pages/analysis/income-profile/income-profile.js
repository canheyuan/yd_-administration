
const app = getApp(); //获取应用实例
const Charts = require('../../../utils/wxcharts-min.js');
var chartsTimer = null;
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,

        monthTag: null,
        monthTagIndex: 1,
        unitSummaryData: null, //
        monthNum: 6,     //结束月份
        yearNow:'',
        yearName:'',

        langData:null,
        lang:'' 
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
                ],
                yearName: res.month6[lang]
            })
        });

        var date = new Date;
        var year = date.getFullYear(); 
        this.setData({ yearNow: year});

        //默认加载
        this.reach();
    },

    reach() {
        this.getIncomeSummary((res)=>{
            this.incomeCharts();
        });
    },

    //改变年份
    changeDateFn(e){
        this.setData({
            monthTagIndex:-1,
            yearName: e.detail.value
        })
        this.incomeCharts('year');
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
        chartsTimer = setTimeout(()=>{
            
            this.incomeCharts();
        },1000); 
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

    //收入概况
    incomeCharts(changeType) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        var incomeChartsData = this.data.incomeChartsData;
        var yearName = this.data.yearName;
        var maxNum = 100;
        if (!incomeChartsData) { return; }
        var categoriesList = Object.keys(incomeChartsData);
        if (changeType == 'year'){  
            //某一年
            categoriesList = categoriesList.filter(item=>{
                console.log('return:', item.indexOf(yearName) != -1);
                return item.indexOf(yearName)!=-1;
            }).reverse();
        }else{
            categoriesList = categoriesList.reverse().slice(-this.data.monthNum); //前几个月
        }
        var categoriesData = categoriesList.map((item, index) => {
            if (maxNum < incomeChartsData[item]) { maxNum = incomeChartsData[item] };   //获取最大值
            return incomeChartsData[item];
        })
        new Charts({
            canvasId: 'incomeCharts',
            background: '#ffffff',
            type: 'line',
            categories: categoriesList,
            series: [{
                name: langData.incomeMoney[lang],
                color: '#de7a80',
                pointColor: '#888888',
                data: categoriesData,
                format: function (val) {
                    return val;
                }
            }],
            yAxis: {
                title: langData.incomeMoney2[lang],
                fontColor: '#888888',
                titleFontColor: '#888888',
                gridColor: '#bbbbbb',
                min: 0,
                max: maxNum,
                format: function (val) {
                    return val
                },
            },
            xAxis: {
                title: langData.monthText[lang],
                fontColor: '#888888',

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

    //下拉刷新
    onPullDownRefresh: function () {
        this.reach();
        wx.stopPullDownRefresh();
    },
})