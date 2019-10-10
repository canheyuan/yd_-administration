var app = getApp();
var langData = app.globalData.langData.resultPage;
var lang = app.globalData.lang;
const page_data = {
    //默认
    nothing: {
        page_title: '',
        icon: '/images/icon/result_nothing.png',
        title: langData.nothing.title[lang],
        des: '',
        details_btn: '',
        details_btn_url: '',
        details_btn_type: '',
        btm_btn: langData.backHomeBtn[lang],
        btm_btn_url: '/pages/index/index',
        btm_btn_type: 'switchTab'
    },
    //找回密码成功页面
    reset_pwd: {
        page_title: langData.reset_pwd.page_title[lang],
        icon: '/images/icon/result_reg.png',
        title: langData.reset_pwd.title[lang],
        des: '',
        details_btn: '',
        details_btn_url: '',
        details_btn_type: '',
        btm_btn: langData.reset_pwd.btm_btn[lang],
        btm_btn_url: '/pages/common/login/login',  //按钮链接地址
        btm_btn_type: 'navigate'  //跳转类型
    },

}

module.exports = {
    page_data: page_data
}
