const app = getApp()    //获取应用实例
const commonFn = require('../../../utils/common.js');   //一些通用的函数
const formTip = require('../../../utils/validateForm.js');   //验证
var countGetCodeTimer = null;     //倒计时定时器

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        getCode: {
            phone: '',
            code: '',
            timer: null,
            text: '',
            sending: false,  //是否已发送
        },
        verificationId: '', //验证码id

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad(options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'formPage', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.findPasswordTitle[lang] });  //设置当前页面的title
            this.setData({ ['getCode.text']: res.public.getCodeBtn[lang] });
        });
    },

    //失去焦点时获取手机号码
    changePhoneFn(e) {
        this.setData({ ['getCode.phone']: e.detail.value })
    },

    //获取手机code
    changeCodeFn(e) {
        this.setData({ ['getCode.code']: e.detail.value })
    },

    //验证码倒计时
    countGetCodeFn() {
        var _this = this, time = 60;
        countGetCodeTimer = setInterval(function () {
            if (time > 0) {
                _this.setData({
                    ['getCode.text']: `${_this.data.langData.public.getCodeBtn2[lang] + time}S`,
                    ['getCode.sending']: true,
                });
            } else {
                clearInterval(countGetCodeTimer);
                _this.setData({
                    ['getCode.text']: _this.data.langData.public.getCodeBtn[lang],
                    ['getCode.sending']: false,
                });
            }
            time--;
        }, 1000);
    },


    //获取验证码
    getCodeFn(e) {
        if (this.data.getCode.sending) { return; } //防止多次点击
        var _this = this,
            phone = this.data.getCode.phone,
            langData = this.data.langData,
            lang = this.data.lang;

        //验证
        var isTip = formTip([
            { name: 'phone', verifyText: phone },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        _this.countGetCodeFn(); //倒计时

        //获取验证码
        app.requestFn({
            loadTitle: langData.public.sendTip[lang],
            url: `/manage/sendResetPwdCode`,
            header: 'application/x-www-form-urlencoded',
            data: {
                mobile: phone
            },
            method: 'POST',
            success: (res) => {
                wx.showToast({ title: langData.public.sendSuccessTip[lang], icon: 'success', duration: 3000 });
                _this.setData({ verificationId: res.data.data.id })
            },
            fail: () => {
                wx.showToast({ title: langData.public.getCodeError[lang], icon: 'none', duration: 3000 });
                clearInterval(countGetCodeTimer);
                _this.setData({
                    ['getCode.text']: langData.public.getCodeBtn[lang],
                    ['getCode.sending']: false
                });
            },
        });
    },


    //确认提交重置
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        console.log("form数据", formData);
        var langData = this.data.langData;
        var lang = this.data.lang;
        //验证
        var isTip = formTip([
            { name: 'phone', verifyText: formData.mobile },
            { name: 'verifyCodeEmpty', verifyText: formData.verifyCode },
            { name: 'password', verifyText: formData.password },
            { name: 'passwordAgain', verifyText: formData.password2 },
            { name: 'passwordContrast', verifyText: formData.password, verifyText2: formData.password2 },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        //验证验证码并提交重置密码
        app.requestFn({
            loadTitle: langData.public.submit[lang],
            url: `/manage/resetpwd`,
            header: 'application/x-www-form-urlencoded',
            data: formData,
            method: 'POST',
            success: (res) => {
                console.log("重置密码接口返回信息：", res.data);
                wx.redirectTo({
                    url: '/pages/common/result/result?page=reset_pwd'
                })
            }
        });

    }
})



// const app = getApp()  //获取应用实例
// const commonFn = require('../../../utils/common.js'); //一些通用的函数
// const formTip = require('../../../utils/validateForm.js');   //验证
// var countGetCodeTimer = null;

// Page({

//   data: {
//     domainUrl: app.globalData.domainUrl,
//     testsumbit: true,  //测试免验证码提交
//     //phone:'13560007151',
//     phone: '',
//     tipText: '',
//     getCodeText: '获取验证码',
//     msgId: '',
//     code: '',
//     verificationId:'', //验证码id

//       langData: null,
//       lang: ''
//   },

//   onLoad: function (options) {
//       //设置语言,判断是否切换语言
//       app.loadLangFn(this, 'formPage', (res,lang) => {
//           wx.setNavigationBarTitle({ title: res.findPasswordTitle[lang] });  //设置当前页面的title
//           this.setData({ ['getCode.text']: res.public.getCodeBtn[lang] });
//       });
//   },

//   //失去焦点时获取手机号码
//   changePhoneFn(e) {
//     this.setData({
//       phone: e.detail.value
//     })
//   },
//   //失去焦点时获取手机号码
//   changeCodeFn(e) {
//     this.setData({
//       code: e.detail.value
//     })
//   },
//   //验证码倒计时
//   countGetCodeFn() {
//     var _this = this
//     var time = 60;
//     countGetCodeTimer = setInterval(function () {
//       if (time > 0) {
//         _this.setData({
//           getCodeText: '重新获取' + time + 'S'
//         })
//       } else {
//         clearInterval(countGetCodeTimer);
//         _this.setData({
//           getCodeText: '获取验证码'
//         })
//       }
//       time--;
//     }, 1000);
//   },
//   //获取验证码
//   getCodeFn(e) {

//     var _this = this,
//       phone = this.data.phone;
//     console.log(phone);
//     if (!commonFn.phoneregFn(phone)) {
//       wx.showToast({ title: '请输入正确的手机号格式', icon: 'none', duration: 3000 });
//       return;
//     }
//     wx.showLoading({ title: '发送中...', mask: true });
//     this.countGetCodeFn();
//     //return;
//     //获取验证码
//     wx.request({
//       url: app.globalData.jkUrl + '/manage/sendResetPwdCode', //接口地址
//       data: {
//         mobile: phone
//       },
//       method: 'POST',
//       header: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         '5ipark-sid': app.globalData.sessionId
//       },
//       success(res) {
//         console.log(res.data);
//         if (res.data.code == 0) {
//           wx.showToast({ title: '发送成功', icon: 'success', duration: 3000 });
//           _this.setData({
//             verificationId: res.data.data.id
//           })
//         }
//       },
//       fail() {
//         wx.showToast({ title: '获取验证码失败', icon: 'none', duration: 3000 });
//         clearInterval(countGetCodeTimer);
//         _this.setData({
//           getCodeText: '获取验证码'
//         })
//       },
//       complete() {
//         wx.hideLoading();  //关闭loading
//       }
//     })
//   },
//   //确认提交重置
//   formSubmit(e) {
//     var _this = this;
//     var formData = e.detail.value;
//     console.log("form数据", formData);
//     if (!commonFn.phoneregFn(formData.mobile)) {
//       wx.showToast({ title: '请输入正确的手机号格式', icon: 'none', duration: 3000 });
//       return;
//     }
//     if (formData.verifyCode == '验证码') {
//       wx.showToast({ title: '请输入验证码', icon: 'none', duration: 3000 });
//       return;
//     }
//     if (formData.password == '') {
//       wx.showToast({ title: '请输入密码', icon: 'none', duration: 3000 });
//       return;
//     }
//     if (formData.password.length < 6) {
//       wx.showToast({ title: '请输入6位以上的密码', icon: 'none', duration: 3000 });
//       return;
//     }
//     if (formData.password != formData.password2) {
//       wx.showToast({ title: '两次密码不一致', icon: 'none', duration: 3000 });
//       return;
//     }
//     wx.showLoading({ title: '数据提交中...', mask: true });
//     //验证验证码并提交重置密码
//     wx.request({
//       url: app.globalData.jkUrl + '/manage/resetpwd', //接口地址/api/
//       data: formData,
//       method: 'POST',
//       header: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         '5ipark-sid': app.globalData.sessionId
//       },
//       success(res) {
//         console.log("重置密码接口返回信息：", res.data);
//         // if (res.data.code == 0 || _this.data.testsumbit) {
//         if (res.data.code == 0 ) {
//           wx.redirectTo({
//             url: '/pages/common/result/result?page=reset_pwd'
//           })

//         } else {
//           console.log(res.data.msg);
//           wx.showToast({ title: res.data.msg, icon: 'none', duration: 3000 });
//         }
//       },
//       fail() {
//         wx.hideLoading();  //关闭loading
//         console.log(res.data.msg);
//         wx.showToast({ title: res.data.msg, icon: 'none', duration: 3000 });
//       },
//       complete() {}
//     })

//   }
// })