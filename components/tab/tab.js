
const app = getApp(); //获取应用实例
Component({
    //
    properties: {

        index: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ tagIndex: newVal });
            }
        },
        //消息数
        msgNum:{
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                console.log('msgNumaa:',newVal)
                this.setData({ msgNum: newVal });
            }
        },

        langChange: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {
                app.loadLangFn(this, 'cpTab', (res,lang) => {
                    this.setData({
                        tagList: [
                            { title: res.menuText1[lang], link: '/pages/index/index', icoClass: 'ico01' },
                            { title: res.menuText2[lang], link: '/pages/wechat/chat-list/chat-list', icoClass: 'ico02' },
                            { title: res.menuText3[lang], link: '/pages/user/user-index/user-index', icoClass: 'ico03' }
                        ]
                    })
                });
            }
        }
    },

    //组件的初始数据
    data: {
        tagList: [],
        tagIndex: 0,
        msgNum:0
    },

    attached() {

    },

    //组件的方法列表
    methods: {

    }
})
