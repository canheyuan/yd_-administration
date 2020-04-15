var configData = {

    nowApp: 'guangfo',    //设置当前哪个小程序的配置信息
    /*---------------------------------------------------------------------------------------------
       更新某个
       各个小程序的配置字段：
       园叮：   yuanding    wx03f270c6defddaf6
       小招：   xiaozhao    wx8b3271e042c204f0
       广佛：   guangfo     wxd13fd304f87c487d
    -----------------------------------------------------------------------------------------------*/



    /*---------------------------------------------------------------------------------------------
       以下是每个小程序的配置，当切换小程序时，需要2步骤
       1、开发者工具详情里把APPID换成要切换的APPID
       2、把上面的nowApp名称改为当前小程序的
    -----------------------------------------------------------------------------------------------*/
    //园叮
    yuanding: {
        
        //模块开关    
        moduleSwitch: {
            lang: false,
            repair: false,  //报修
            coupon: false,  //优惠券
            contract: false,  //合同
            degrees: false,   //水电度数
            feeCheck: false,  //代缴查询
            report: false,  //报表
            complaint: false, //投诉建议模块
        },

        mtjAppKey: 'cee2ecfa32',    //百度统计appKey

        //不同小程序传参
        appApi: {
            channel: '',  //园叮不传，小招传cmb
            aid: '9P7DW1W783' //后端生成小程序id，主要识别当前是哪个id
        }
    },

    //小招园叮
    xiaozhao: {
        jkUrl: 'https://demo.5iparks.com/api',              //接口正式版
        //模块开关    
        moduleSwitch: {
            lang: false,
            repair: false,  //报修
            coupon: false,  //优惠券
            contract: false,  //合同
            degrees: false,   //水电度数
            feeCheck: false,  //代缴查询
            report: false,  //报表
            complaint: false, //投诉建议模块
        },

        mtjAppKey: '1735b18fcb',    //百度统计appKey

        //不同小程序传参
        appApi: {
            channel: 'cmb',  //园叮不传，小招传cmb
            aid: 'JVGZJAKYNF' //后端生成小程序id，主要识别当前是哪个id
        }
    },

    //广佛数字创意园园叮系统
    guangfo: { 
        //模块开关    
        moduleSwitch: {
            lang: false,
            repair: false,  //报修
            coupon: false,  //优惠券
            contract: false,  //合同
            degrees: false,   //水电度数
            feeCheck: false,  //代缴查询
            report: false,  //报表
            complaint: false, //投诉建议模块
        },


        mtjAppKey: '66199dfa95',    //百度统计appKey

        //不同小程序传参
        appApi: {
            channel: '',  //园叮不传，小招传cmb
            aid: 'CPXFYI37IW' //后端生成小程序id，主要识别当前是哪个id
        }
    }

}

var appConfigData = {
    //腾讯云Im的一些配置信息
    COSv5: {
        appid: '01254126397', // Bucket 所属的项目 ID
        bucket: "miniprog001-1254126397",  //空间名称 Bucket demo的IM处理封装
        region: 'ap-guangzhou', //ap-
        sid: 'AKID1whIhuqlRDrMgp8vxqcDuVv9B3EJ9RRI', // 项目的 SecretID
        skey: 'rbEkZIuNeNzUoEYq25zkw1wkWEnDRsFX' // 项目的 Secret Key
    },
    IM: {
        sdkAppID: 1400131035,
        appIDAt3rd: 1400131035, //用户所属应用id，必填
        accountType: 36152, //用户所属应用帐号类型，必填
    },

    /*-------------- 配置信息-Start --------------*/
    jkUrl: configData[configData.nowApp].jkUrl,       //接口正式版
    mtjAppKey: configData[configData.nowApp].mtjAppKey,    //百度统计appKey
    appApi: configData[configData.nowApp].appApi,   //小程序后台配置
    moduleSwitch: configData[configData.nowApp].moduleSwitch,   //模块开关    
    /*-------------- 配置信息-End --------------*/


}

module.exports = appConfigData;
