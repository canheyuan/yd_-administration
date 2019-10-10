
const app = getApp()    //获取应用实例
const datas = require('nothing-data.js');   //页面内容数据
const pageInfo = datas.page_data;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cName:String
  },
  data: {
    domainUrl: app.globalData.domainUrl,
    pageData: {
      icon: '/images/icon/result_nothing.png',
      title: '暂无内容哦！',
      btm_btn: '返回首页',  //底部按钮文字跳转类型
      btm_btn_url: '/pages/index/index',  //底部按钮链接
      btm_btn_type: 'switchTab'  //底部按钮跳转类型
    }

  },
  //组件加载完成后
  attached(){
    let c_name = this.properties.cName;
    
    let datas = pageInfo[c_name];
    
    this.setData({
      pageData: datas
    });
    this.triggerEvent('getTitle', this.data.pageData.page_title);
  },

  methods: {

  }
})
