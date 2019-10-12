// components/reach-load/reach-load.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        mTop: { 
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ mTop: newVal });
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        mTop:40
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
