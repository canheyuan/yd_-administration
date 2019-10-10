const app = getApp();  //获取应用实例
var langData = app.globalData.langData.coupon;
var lang = app.globalData.lang;
const page_data ={
    //无效优惠券
    coupon403: {
        page_title: langData.coupon403.page_title[lang],
        icon: '/images/icon/scan_error.png',
        title: langData.coupon403.title[lang],
        des: '',
        details_btn: '',
        details_btn_url: '',
        details_btn_type: '',
        btm_btn: langData.coupon403.btm_btn[lang],
        btm_btn_url: '/pages/index/index',
        btm_btn_type: 'switchTab'
    },
    //无效优惠券
    coupon404: {
        page_title: langData.coupon404.page_title[lang],
        icon: '/images/icon/scan_error.png',
        title: langData.coupon404.title[lang],
        des: '',
        details_btn: '',
        details_btn_url: '',
        details_btn_type: '',
        btm_btn: langData.coupon404.btm_btn[lang],
        btm_btn_url: '/pages/index/index',
        btm_btn_type: 'switchTab'
    }
}

module.exports = {
  page_data: page_data
}
