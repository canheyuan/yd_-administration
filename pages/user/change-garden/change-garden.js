

const app = getApp();  //获取应用实例

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        loginInfo: null,
        listInfo: [],
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        this.setData({
            loginInfo: app.globalData.userInfo
        });
        this.getListInfo(); //获取用户列表
    },

    //获取园区列表
    getListInfo() {
        var _this = this;
        app.requestFn({
            url: `/manage/parkInfo/list`,
            success: (res) => {
                console.log("园区列表：", res);
                var list = res.data.data;
                var parkAddress = '';
                list.forEach(item=>{
                    if (item.parkId == this.data.loginInfo.curParkId){
                        parkAddress = item.address;
                    }
                })

                this.setData({
                    ['loginInfo.parkAddress']: parkAddress,
                    listInfo: list 
                });    //设置data数据
            }
        });
    },

    //选择园区
    chooseGardenFn(e) {
        var gardenItem = e.currentTarget.dataset.item;
        app.requestFn({
            isLoading:false,
            url: `/manage/parkInfo/select`,
            data: {
                parkId: gardenItem.parkId
            },
            header: 'application/x-www-form-urlencoded',
            method: 'POST',
            success: (res) => {
                //获取缓存，改变缓存里的信息，然后重新设置缓存
                var loginInfo = wx.getStorageSync('userInfo');
                loginInfo.curParkId = gardenItem.parkId;
                loginInfo.curParkName = gardenItem.parkName;
                loginInfo.parkAddress = gardenItem.address;

                wx.setStorageSync('userInfo', loginInfo); //设置缓存用户信息
                app.globalData.userInfo = loginInfo;  //获取用户信息
                app.globalData.indexReach = true;
                this.setData({ loginInfo: loginInfo });

                wx.showToast({ title: '切换成功！', icon: 'success', duration: 2000 });

                setTimeout(function () {
                    wx.navigateBack();
                }, 1000);
            }
        });

    },
})