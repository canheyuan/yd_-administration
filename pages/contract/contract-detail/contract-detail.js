const commonFn = require('../../../utils/common.js');
const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null, //详情页数据

        nowDate: '',  //当前时间戳

        langData: null,
        lang: ''
    },

    onLoad: function (options) {
        var date1 = new Date;
        date1 = date1.getTime();
        this.setData({ nowDate: date1 });

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'contract', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.detailTitle[lang] });  //设置当前页面的title
        });

        this.getContractDetail(options.id);
    },

    //获取报修详情
    getContractDetail(id) {
        var langData = this.data.langData;
        var lang = this.data.lang;
        app.requestFn({
            url: `/manage/contract/detail/${id}`,
            success: (res) => {
                var detailsData = res.data.data;
                //计算到期天数
                var strtime = detailsData.contractEnd + ' 00:00:00';
                var date = new Date(strtime.replace(/-/g, '/'));
                var sjc_end = Date.parse(date);
                detailsData.endDay = parseInt((sjc_end - this.data.nowDate) / 1000 / 3600 / 24);

                if (detailsData.endDay < 0) {
                    detailsData.statusClass = 'epd';
                    detailsData.statusText = langData.statusText3[lang];
                } else if (detailsData.endDay < 130) {
                    detailsData.statusClass = 'warn';
                    detailsData.statusText = detailsData.endDay + langData.statusText2[lang];
                } else {
                    detailsData.statusClass = '';
                    detailsData.statusText = langData.statusText1[lang];
                }

                //获取各类信息
                detailsData.fees.forEach((item) => {
                    if (item.type == "rent") { //租金
                        detailsData.rent = item
                    } else if (item.type == "electric") { //电费
                        detailsData.electric = item
                    } else if (item.type == "water") { //水费
                        detailsData.water = item
                    }
                })
                //获取房间名
                var roomsName = ''
                detailsData.rooms.forEach((item) => {
                    roomsName += item.roomName
                });
                detailsData.roomsName = roomsName;

                this.setData({ detailsData: detailsData });
            }
        });

    }
})