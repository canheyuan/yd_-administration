module.exports = {

    //模块开关    
    moduleSwitch: {
        lang:false,
        repair: false,  //报修
        coupon: false,  //优惠券
        contract: false,  //合同
        degrees: false,   //水电度数
        feeCheck: false,  //代缴查询
        report: false,  //报表
    },

    mtjAppKey: 'cee2ecfa32',    //百度统计appKey

    //不同小程序传参
    appApi: {
        channel: '',  //园叮不传，小招传cmb
        aid: '9P7DW1W783' //后端生成小程序id，主要识别当前是哪个id
    }
}
