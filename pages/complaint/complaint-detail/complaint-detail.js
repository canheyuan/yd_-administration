//获取应用实例
const app = getApp()
Page({
  data: {
    domainUrl: app.globalData.domainUrl,
    loginInfo:null,
    detailsData:null, //详情数据
    detailsImgs:[], //详情图片地址数组
    progressDetails:true, //详细进度是否隐藏
    popIsShow: true, //服务价格一览表弹窗是否显示
    infoShow:true, //报修更多内容是否隐藏
    tipType: '', //提示弹窗类型remove、star
    tipPopShow: true,  //是否隐藏提示弹窗
    starScore: 0,  //评分分数
    repairId: '', //报修id
    servePop: false,  //服务价格一览表显示隐藏
    repairMoney:null,
    maintainersIndex:0,
    maintainerPop:false, //维修人员弹窗

    imgPopHide: true,
    popImgUrl: ''
  },

  onLoad: function (options) {
    console.log("报修分配：",this.data.loginInfo);
    this.setData({ 
      loginInfo:app.globalData.userInfo,
      repairId: options.id
    });  //存储报修id
    //this.getRepairDetail(options.id); //获取详情信息
    this.getRepairDetail('972f8ff3d9396ec97ec9aa0eb25fb779');

  },

  //获取报修详情
  getRepairDetail(id){
    app.requestFn({
      url: `/estateComplaint/detail/${id}`,
      success: (res) => {
        console.log('投诉处理详情：',res);
        return;
        var detailsData = res.data.data;
        if (!!detailsData.maintainers){
          detailsData.maintainers.forEach(item=>{
            item.title = `${item.userName}  (${item.phonenumber})`;
          });
        }
        this.setData({
          detailsData: detailsData,
          detailsImgs: detailsData.images ? detailsData.images.split(',') : [],
        })
        console.log("报修详情：",detailsData);
      }
    });
  },

  //设置跟进
  setFollow(){
    var  _this = this;
    app.requestFn({
      url: `/manage/estateRepair/follow/${_this.data.repairId}`,
      method: 'POST',
      success: (res) => {
        _this.getRepairDetail(_this.data.repairId);
        app.globalData.repairReach = false;
      }
    });
  },

  //设置完成
  setComplete(){
    var _this = this
    app.requestFn({
      url: `/manage/estateRepair/complete`,
      header:'application/x-www-form-urlencoded',
      data: {
        repairId: _this.data.repairId,
        repairMoney: _this.data.repairMoney,
      },
      method: 'POST',
      success: (res) => {
        _this.getRepairDetail(_this.data.repairId);
        _this.servePopFn();
        app.globalData.repairReach = false;
      }
    });
  },

  //输入报修费用文本框失去焦点时执行
  blurInput(e){
    var data= e.detail.value;
    this.setData({repairMoney: data })
  },

  //服务完成弹窗开关
  servePopFn(){
    this.setData({
      servePop:!this.data.servePop
    })
  },

  //打开关闭服务价格一览表弹窗
  popFn() {
    this.setData({
      popIsShow: !this.data.popIsShow
    })
  },
  



  //弹出维修人员弹窗
  maintainerPopShow() {
    this.setData({
      maintainerPop: !this.data.maintainerPop
    })
  },

  //选择分配维修人员
  chooseMaintainersFn(e){
    var _this = this;
    var loginName = _this.data.detailsData.maintainers[e.detail.value].loginName;
    app.requestFn({
      url: `/manage/estateRepair/appoint`,
      header:'application/x-www-form-urlencoded',
      data: {
        "repairId": _this.data.detailsData.repairId,
        "handler": loginName,
        "remark": ""
      },
      method: 'POST',
      success: (res) => {
        wx.showToast({ title: '分派成功！', icon: 'success', duration: 3000 });
        _this.maintainerPopShow();
        setTimeout(() => {
          _this.getRepairDetail(_this.data.detailsData.repairId);
        }, 2000);
      }
    });
  },

  //图片放大
  bigImgFn(e) {
    console.log(e)
    var imgUrl = e.currentTarget.dataset.big_img;
    this.setData({
      imgPopHide: !this.data.imgPopHide,
      popImgUrl: imgUrl
    });
  },

  //关闭弹窗
  closeImgPop() {
    this.setData({
      imgPopHide: !this.data.imgPopHide
    });
  }
  
})
