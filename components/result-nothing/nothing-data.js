
function pageDataFn() {
    const app = getApp();  //获取应用实例
    var lang = app.globalData.lang;
    var langData = app.globalData.langData.nothingData;
    const page_data = {
        //通用
        nothing: {
            icon: '/images/icon/result_nothing.png', //图标
            title: langData.nothing.title[lang],    //标题
            des: '',  //描述
            details_btn: '',  //描述下面按钮
            details_btn_url: '',  //描述下面按钮链接
            details_btn_type: '', //描述下面按钮
            btm_btn: langData.backHomeBtn[lang],  //底部按钮文字跳转类型
            btm_btn_url: '/pages/index/index',  //底部按钮链接
            btm_btn_type: 'switchTab'  //底部按钮跳转类型
        },
        //活动列表暂无状态
        degrees: {
            icon: '/images/icon/result_nothing.png',
            title: langData.degrees.title[lang],
            des: '',
        },
        degrees2: {
            icon: '/images/icon/result_nothing.png',
            title: langData.degrees2.title[lang],
            des: '',
        },
        contract: {
            icon: '/images/icon/result_nothing.png',
            title: langData.contract.title[lang],
            des: '',
        },
        fee: {
            icon: '/images/icon/result_nothing.png',
            title: langData.fee.title[lang],
            des: '',
        },
        repair: {
            icon: '/images/icon/result_nothing.png',
            title: langData.repair.title[lang],
            des: '',
        },
        notice: {
            icon: '/images/icon/result_nothing.png',
            title: langData.notice.title[lang],
            des: '',
        },
        message: {
            icon: '/images/icon/result_nothing.png',
            title: langData.message.title[lang],
            des: ''
        },
        backlog: {
            icon: '/images/icon/result_nothing.png',
            title: langData.backlog.title[lang],
            des: ''
        },
        complaint: {
            icon: '/images/icon/result_nothing.png',
            title: langData.complaint.title[lang],
            des: ''
        }
    }
    return page_data
}

module.exports = {
    page_data: pageDataFn
}
