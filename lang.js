module.exports = {
    //公用
    public: {
        dfParkName:{ zh:'园叮智慧园区', en:'' },
        //提示
        submitTip: { zh: '提交中', en: 'submiting' },
        deleteTip: { zh: '删除中', en:'deleting' },
        sendTip: { zh: '发送中...', en: 'sending...' },
        loadingTip: { zh: '数据加载中', en:'Loading' },
        editTip: { zh: '修改中...', en: 'Amendment...' },
        loginTip: { zh: '登录中...', en: 'Login...' },
        editSuccess: { zh: '修改成功', en: 'Modified success' },
        sendSuccessTip: { zh: '发送成功', en: 'Send successfully' },
        callOffCollect: { zh: '取消收藏', en: 'Cancel collection' },
        callOffCollectTip: { zh: '已取消收藏', en: 'Cancelled collection' },
        loginTimeoutTip: { zh: '登录已超时，请重新登录再进行操作', en: 'The login has timed out, please log in again and proceed!' },
        loadErrorTip: { zh: '数据加载失败', en: 'Data loading failed' },
        warmTip: { zh: '温馨提示', en: 'Reminder' },
        phoneTip: { zh: '手机号格式不正确', en:'Incorrect format of mobile phone number'},

        noDesTip: { zh: '暂无描述', en: 'No description' },
        moreText: { zh: '上拉加载更多', en: 'Pull up load more' },
        noMoreText: { zh: '没有更多了', en: 'No more' },

        //表单字段
        time: { zh: '时间', en: 'Time'},
        name: { zh: '姓名', en: 'Name' },
        contact: { zh: '联系人', en: 'Contact' },
        contactPhone: { zh: '联系电话', en: 'CellPhone' },
        companyName: { zh: '企业名称', en:'Company Name'},
        
        phone:{zh:'手机号码',en:'CellPhone'},
        verifyCode: { zh: '验证码', en: 'Verification code' },
        password: { zh: '输入密码', en: 'Password' },
        resetPassword: { zh: '重设密码', en: 'Reset Password' },
        verifyPassword: { zh: '确认密码', en: 'Confirm password' },
        email: { zh: '邮箱地址', en: 'Email' },
        imgAccessory: { zh: '图片附件', en:'Image attachment'},
        useExplain: { zh: '使用说明', en:'Description'},
        applyTime: { zh: '申请时间', en: 'Application Time' },
        submitTime: { zh: '提交时间', en:'Submission time'},

        //input  placeholder提示
        phonePl: { zh: '请填写手机号码', en: 'Please fill in your cell phone number.' },
        verifyCodePl: { zh: '填写验证码', en: 'Fill in the verification code' },
        passwordPl: { zh: '请输入6位以上的密码', en: 'Please enter a password of more than 6 digits' },
        verifyPasswordPl: { zh: '请再次输入密码', en: 'Please enter your password again.' },

        //标签
        unread: { zh: '未读', en: 'unread' },
        more: { zh: '更多', en: 'More' },
        all: { zh:'全部',en:'All'},
        toText:{zh:'至',en:'To'},

        //按钮
        getCodeBtn: { zh: '获取验证码', en: 'Get Code' },
        getCodeBtn2: { zh: '重新获取', en: 'Reacquire' },
        callOffBtn: { zh: '取消', en: 'Cancel' },
        confirmBtn: { zh: '确定', en: 'Confirm' },
        submitBtn: { zh: '立即提交', en: 'Submit' },
        submitBtn2: { zh: '提交', en: 'Submit' },
        verifySubmitBtn: { zh: '确认提交', en: 'Submit' } ,
        saveBtn: { zh: '保存', en: 'Save' },
        backIndexBtn: { zh: '返回首页', en: 'Back To Home' },
        agreeBtn: { zh: '同意', en: 'Agree' },
        rejectBtn: { zh: '拒绝', en: 'Reject' }
    },
    
    //验证
    validate: {
        empty: { zh: '不能为空', en:'Can not be empty'},
        phone: { zh: '手机号格式有误', en: 'The format of mobile phone number is incorrect' },
        email: { zh: '邮箱格式有误', en: 'Error in mailbox format' },
        verifyCodeEmpty: { zh: '验证码不能为空', en: 'Verification code cannot be empty' },
        password: { zh: '请输入6位以上密码', en: 'Please enter more than 6 passwords' },
        passwordAgain: { zh: '请再次输入密码', en: 'Please enter your password again.' },
        passwordContrast: { zh: '两次密码不一致', en: 'Two password inconsistencies' },
        userName: { zh: '请输入用户名', en: 'Enter one user name' },
        park: { zh: '请选择园区', en: 'Please choose the park.' },
        ent: { zh: '请选择企业', en: 'Please choose the enterprise' },
        name: { zh: '请输入您的名字', en: 'Please enter your name.' },
        date: { zh: '请选择预约日期', en: 'Please choose the appointment date.' },
        time: { zh: '请选择预约时间', en: 'Please choose the appointment time.' },
    },

    //结果页
    resultPage:{
        nothing: {
            page_title: '',
            title: { zh: '暂无内容！', en: 'No content for the time being!' },
        },
        reset_pwd: {
            page_title: { zh: '重置密码成功', en: 'Successful password reset' },
            title: { zh: '恭喜！重设密码成功！', en: 'Congratulations! Successful password reset!' },
            btm_btn: { zh: '返回登录界面', en: 'Return to the login interface' }
        },
        backHomeBtn: { zh: '返回首页', en:'Back to home'}
    },

    //首页index
    index: {
        indexTitle: { zh: '园叮智慧园区', en: 'Yuanding Wisdom Park' },
        noticeImg: { zh: 'notice_tit.png', en: 'notice_tit_en.png' },
        // menu:{
        //     repair: { zh: '报修处理', en: '' },
        //     scanCode: { zh: '扫码核销', en: '' },
        //     contract: { zh: '合同查看', en: '' },
        //     degrees: { zh: '水电度数', en: '' },
        //     fee: { zh: '待缴查询', en: '' },
        //     onlineRepair: { zh: '在线报修', en: '' },
        //     report: { zh: '数据分析', en: '' }
        // },
        backlogTitle: { zh: '待办事项', en: 'Backlog' },
        unreadTitle: { zh: '未读消息', en: 'Unread message' },
        feeTitle: { zh: '待缴企业', en: 'Enterprises to be paid' },
        editBtn: { zh: '编辑资料', en: 'Editing' },
        newText: { zh: '最新', en: 'news' },
        recentText: { zh: '近期', en: '' },
    },

    //聊天
    chat: {
        title: { zh: '消息中心', en: 'Message Center' },
        systemNotice: { zh: '系统公告', en: 'Notification' },
        systemDes: { zh: '园区的通知和公告', en: 'Notices and announcements of park' },
        message: { zh: '通知消息', en: 'Message' },
        mesDes: { zh: '事项的进度消息等', en: 'Progress message of the matter, etc' },
        chating: { zh: '聊天中....', en: 'Chatting....' },
        sendBtn: { zh: '发送', en: 'Send' },
        otherText: { zh: '[其他]', en: '[other]' }
    },

    //我的页面
    userIndex: {
        title: { zh:'我的',en:'User'},
        changeLangBtn: { zh: '切换语言', en: 'Language' },
        changeGardenBtn: { zh: '切换园区', en: 'Switching Park' },
        buildTip: { zh: '建设中...', en: 'Development...' },
        park: { zh: '园区', en: 'Park' },
        name: { zh: '真实姓名', en: 'Real Name' },
        realName: { zh: '实名认证', en: 'Real name authentication' },
        nickName: { zh: '昵称', en: 'Nickname' },
        inputNickName: { zh: '输入昵称', en: 'Input nickname' },
        sex: { zh: '性别', en: 'Sex' },
        sexName1: { zh: '保密', en: 'secrecy' },
        sexName2: { zh: '男', en: 'man' },
        sexName3: { zh: '女', en: 'woman' },
        bindPhone: { zh: '绑定手机', en: 'Bind cell phone' },
        bindEmail: { zh: '绑定邮箱', en: 'Bind mailbox' },
        verifyRecord: { zh: '核销记录', en: 'Write off record' },
        outLogin: { zh: '退出登录', en: 'Logout' },
        versions: { zh: '当前版本', en: 'Version' },
        outTipTitle: { zh: '退出登录', en: 'Logout' },
        outTipAlert: { zh: '退出系统后将不能接收各种通知，\n仍然退出？', en: 'After exiting the system, you will not be able to receive all kinds of notifications, but still quit?' },
        outTip: { zh: '退出中', en: 'Sign out..' },
    },

    //通知消息
    message: {
        listTitle: { zh: '通知消息', en: 'Notification message' },
        noticeTitle: { zh: '通知公告', en: 'Notice' }
    },

    //报修处理
    repair:{
        title: { zh: '报修处理', en: 'Repair' },
        tagName1: { zh: '待处理', en: 'Pending' },
        tagName2: { zh: '跟进中', en: 'Follow up' },
        tagName3: { zh: '已完成', en: 'Completed' },
        repairType: { zh: '报修类型', en: 'Repair Type' },
        repairPerson: { zh: '报修人', en: 'Applicant' },
        repairAddress: { zh: '报修地址', en: 'Repair Address' },
        noImg: { zh: '暂无图片', en: 'No Pictures' },
        severPopBtn: { zh: '有偿服务价格一览表 >>', en: 'List of Paid Service Prices >>' },
        handlerName: { zh: '维修人员', en: 'Repair personnel' },
        collectMoney: { zh: '实收金额', en: 'Amount received' },
        customerScoring: { zh: '客户评分', en: 'Customer ratings' },
        repairTime: { zh: '报修时间', en: 'Repair Time' },
        sendOrdersTime: { zh: '派单时间', en: 'Delivery Time' },
        finishTime: { zh: '完成时间', en: 'Completion Time' },
        followBtn: { zh: '我要跟进', en: 'Follow-up' },
        disposeBtn: { zh: '我要跟进', en: 'Follow-up' },
        assignBtn: { zh: '分派跟进', en: 'Assign Follow-up' },

        popTitle: { zh: '服务完成', en: 'Service completion' },
        popDes1: { zh: '感谢您对我们的支持！', en: 'Thank you for your support!' },
        popDes2: { zh: '本次维修支付的金额是：', en: 'The amount paid for this maintenance is:' },
        pricePl: { zh: '请填写支付金额', en: 'Please fill in the amount of payment.' },
        assignTip: { zh: '分派成功！', en: 'Distribution success!' },
    },

    //水电度数
    degrees: {
        title: { zh: '水电度数', en: '' },
        selectName1: { zh:'企业水电',en:''},
        selectName2: { zh: '公摊水电', en: '' },
        tagName1: { zh: '未抄表', en: ''},
        tagName2: { zh: '已抄表', en: ''},
        chooseFloor: { zh:'选择楼层',en:''},
        allFloor: { zh:'所有楼栋',en:''},
        monthText: { zh: '月份', en: '' },
        entering: { zh: '录入', en: '' },
        enteringTime: { zh: '录入时间', en: '' },
        noEnteringTip: { zh: '尚未录入', en: '' },
        monthAmmeter: { zh: '本月电表读数', en: '' },
        ammeterMultiple: { zh: '电表倍数', en: '' },
        multipleText: { zh: '倍', en: '' },
        writePl: { zh: '请填写', en: '' },
        fileImg: { zh: '上传照片', en: '' },
        countTitle: { zh: '如需调整实际用量，请在下面填写：', en: '' },
        countPl: { zh: '请填写实际用量', en: '' },
        remark: { zh: '备注消息', en: '' },
        remarkPl: { zh: '请输入备注信息', en: '' },
        noRemarkTip: { zh: '暂无备注信息！', en: '' },
        prevAmmeter: { zh: '上次抄表', en: '' },
        prevCount: { zh: '上次用量', en: '' },
        prevReading: { zh: '上次度数', en: '' },
        readingImg: { zh: '读数照片', en: '' },
        noImg: { zh: '暂无照片', en: '' },
        checkBtn: { zh: '查看>>', en: '' },
        submitTime: { zh: '提交时间', en: '' },

        monthWater: { zh: '本月水表读数', en: '' },
        waterMultiple: { zh: '水表倍数', en: '' },

        monthGas: { zh: '本月煤气表读数', en: '' },
        gasMultiple: { zh: '煤气表倍数', en: '' },
        fangText: { zh: '方', en: '' },
        dunText: { zh: '吨', en: '' },
        duText: { zh: '度', en: '' },

        curMonthTip: { zh: '本月', en: '' },
        countTip: { zh: '读数不能低于上月的！', en: '' },
        noEnteringCountTip: { zh: '未录表数据或需录入实际用量！', en: '' },
        successTip: { zh: '成功！', en: '' },

        statusName1: { zh: '未录入', en: '' },
        statusName2: { zh: '已录入', en: '' },
        chooseMonth: { zh: '选择月份', en: '' },

        waterName: { zh: '水表', en: 'water meter' },
        ammeterName: { zh: '电表', en: 'ammeter' },
    },

    //合同
    contract: {
        listTitle: { zh: '合同查看', en:'Contract View'},
        detailTitle: { zh: '合同详情', en: 'Contract Details' },
        tagText1: { zh: '有效合同', en: 'Valid contract' },
        tagText2: { zh: '历史合同', en: 'Historical contract' },
        statusText1: { zh: '正常', en: 'normal' },
        statusText2: { zh: '天后过期', en: '' },
        statusText3: { zh: '已过期', en: 'Expired' },
        contractTime: { zh: '合同时间', en: 'Contract Time' },
        contractNo: { zh: '合同编号', en: 'Contract Number' },
        //详情页
        contacts: { zh: '法人/联系人', en: 'Legal Person' },
        handling: { zh: '经手人', en: 'Experienced Person' },
        tower: { zh: '楼栋单元', en: 'Building Unit' },
        contractDate: { zh: '签约日期', en: 'Contract Date' },
        area: { zh: '面积', en: 'Area' },
        rentTitle: { zh: '租金', en: 'Rent' },
        yuanUnit: { zh: '单价（元）', en: 'Price (RMB)' },
        monthRentPrice: { zh: '月租金（元）', en: 'Monthly Rent (RMB)' },
        sumPrice: { zh: '合同总金额（元）', en: 'Total Contract Amount (RMB)' },
        contractPeriod: { zh: '合同期限', en: 'Contract period' },
        periodTime1: { zh: '合同起', en: 'Contract starts' },
        periodTime2: { zh: '合同止', en: 'Contract end' },
        rentMonth: { zh: '租赁月份', en: 'Rental month' },
        freeRent: { zh: '免租期', en: 'Rent free period' },
        freeRentTime1: { zh: '免租期起', en: 'Rent-free period begins' },
        freeRentTime2: { zh: '免租期止', en: 'End of rent-free period' },
        freeMonth: { zh: '免租月份', en: 'Rent free month' },
        specialClause: { zh: '特别条款', en: 'Special provisions' },
    },

    //待缴查询
    fee: {
        title: { zh: '待缴查询', en:'Pending inquiries'},
        tagName1: { zh: '待缴费企业', en: 'Unpaid Enterprises' },
        tagName2: { zh: '已缴费企业', en: 'Payable Enterprises' },
        statusName1: { zh: '未缴纳', en: 'Unpaid' },
        statusName2: { zh: '已缴纳', en: 'Paid' },
        statusName3: { zh: '已开票', en: 'Invoiced' },
        monthText: { zh: '月份应缴费用', en: 'Payable in' },

        //详情
        month: { zh: '月份', en: 'Month' },
        costCompany: { zh: '已缴纳企业', en: 'Payable Enterprises' },
        noCostCompany: { zh: '待缴纳企业', en: 'Unpaid Enterprises' },
        feeCost: { zh: '应缴费用', en: 'Payable cost' },
        costDetail: { zh: '费用明细', en: 'Details of expenses' },
        costMonth: { zh: '计费月份', en: 'Billing month' },
        month2: { zh: '月', en:'Month'},
        costProject: { zh: '计费项目', en: 'Billing item' },
        detailBtn: { zh: '详情 >', en: 'Detail >' },
        money: { zh: '金额', en: 'Amount of money' },
        companyContact: { zh: '企业联系人', en: 'Corporate Contacts' },
        costTime: { zh: '缴费时间', en: 'Payment time' },
        //缴费详情
        particulars: { zh: '明细', en: 'Detailed' },
        cost: { zh: '费用', en: 'Cost' },
        room: { zh: '房间', en: 'Room' },
        price: { zh: '单价', en: 'Unit Price' },
        priceUnit: { zh: '元/平方米', en: 'yuan per square metre' },
        area: { zh: '面积', en: 'Area' },
        areaUnit: { zh: '平方米', en: 'Square meter' },
        prevAmmeter: { zh: '上次抄表', en: 'Last meter reading' },
        curAmmeter: { zh: '本次抄表', en: 'This meter reading' },
        prevReading: { zh: '上月读数', en: 'Last month reading' },
        curReading: { zh: '本月读数', en: 'Reading this month' },
        curShareFee: { zh: '本月公摊', en: 'Public stalls this month' },
        realityCount: { zh: '实际用量', en: 'Actual consumption' },
        fangText: { zh: '方', en: 'party' },
        dunText: { zh: '吨', en: 'tons' },
        duText: { zh: '度', en: 'degree' },
    },

    //数据分析
    analysis:{
        title: { zh: '数据分析', en: 'Data analysis' },
        area: { zh: '园区面积', en: 'Park Area' },
        floorNum: { zh: '楼宇数量(栋)', en: 'Buildings Num' },
        companyNum: { zh: '企业数量(家)', en: 'Company Num' },
        income: { zh: '收入概况', en: 'Income profile' },
        moreIncome: { zh: '更多收入概况 >>', en: 'More Income Profile >>' },
        rentalRatio: { zh: '出租比例', en: 'Rental Ratio' },
        leaseStatus: { zh: '租赁状态', en: 'Lease Status' },
        month3: { zh: '三个月', en: '3 months' },
        month6: { zh: '半年', en: '6 months' },
        aYear: { zh: '一年', en: 'A year' },
        rentStatus1: { zh: '正常', en: 'Normal' },
        rentStatus2: { zh: '快到期', en: 'Expire soon' },
        incomeMoney: { zh: '收入金额', en: 'Amount of income' },
        incomeMoney2: { zh: '收入金额(元)', en: 'Amount of income(RMB)' },
        monthText: { zh: '月份', en: 'Month' },
        ratioStatus1: { zh: '未使用', en: 'Not used' },
        ratioStatus2: { zh: '已预定', en: 'Scheduled' },
        ratioStatus3: { zh: '已租赁', en: 'Already leased' },
    },

    //登录
    formPage: {
        findPasswordTitle: { zh: '找回密码', en:'Find password'},
        loginTitle: { zh: '登录', en: 'Sign In' },
        forgetPassword: { zh: '忘记密码', en: 'forget password' },
        loginBtn: { zh: '立即登录', en: 'Sign In' },
        password: { zh: '密码', en:'Password'},
        userPl: { zh: '账号/手机号', en:'Account/Cell Phone Number'}
    },

    //优惠券
    coupon:{
        title: { zh: '优惠券', en:'Coupon'},
        recordTitle: { zh: '核销记录', en: 'Write off record' },
        useTitle: { zh: '使用优惠券', en: 'Clip coupons' },
        getTime: { zh: '领取时间', en: 'Time to collect' },
        free: { zh: '免费', en: 'Free Admission' },

        detailInfo: { zh: '详细信息', en: 'Detailed information' },
        issueTime: { zh: '领取时间', en: 'Time to collect' },
        validTime: { zh: '生效时间', en: 'Entry-into-force time' },
        couponCode: { zh: '优惠券码', en: 'Coupon code' },
        useTime: { zh: '使用时间', en: 'Use time' },
        zheText: { zh: '折', en: '' },
        yuanText: { zh: '元', en: '' },
        manText: { zh: '满', en: '' },
        jianText: { zh: '减', en: '' },
        text1: { zh: '元立减', en: '' },
        text2: { zh: '元使用', en: '' },
        text3: { zh: '无条件使用', en: '' },
        text4: { zh: '元立打', en: '' },
        text5: { zh: '领券', en: '' },
        text6: { zh: '天内', en: '' },
        text7: { zh: '开始', en: '' },
        yqText: { zh: '已抢', en: '' },
        lqBtn: { zh: '立即领取', en: 'Receive' },
        myCouponBtn: { zh: '我的卡券包 >>', en: 'My card bag >>' },
        lqSuccess: { zh: '领券成功', en: 'Successful ticket collection' },
        popText1: { zh: '恭喜，优惠券已领取成功', en: 'Congratulations, the coupon has been successful' },
        popText2: { zh: '并已放到您的账户', en: 'And it has been deposited in your account' },
        popUseBtn: { zh: '去使用', en: 'To use' },
        verifyTime: { zh: '核销时间：', en: 'Write-off time:' },
        startTime: { zh: '领取时间：', en: 'Receiving time:' },
        endTime: { zh: '结束时间：', en: 'Ending time:' },
        pastDue: { zh: '已过期:', en: 'Expired' },

        status1: { zh: '即将开始', en: 'begin in a minute' },
        status2: { zh: '领取中', en: 'receiving' },
        status3: { zh: '已领完', en: 'finished' },
        status4: { zh: '已过期', en: 'expired' },

        btnName1: { zh: '立即使用', en: 'Use' },
        btnName2: { zh: '已使用', en: 'Already used' },
        btnName3: { zh: '已过期', en: 'Expired' },
        btnName4: { zh: '确认核销', en: 'Confirm cancellation' },

        tagName1: { zh: '未使用', en: 'not used' },
        tagName2: { zh: '已使用', en: 'Already used' },
        tagName3: { zh: '已过期', en: 'Expired' },

        verifySuccessTip: { zh: '恭喜，核销成功！', en: 'Congratulations on the successful cancellation！' },
        scanAgain: { zh: '重新扫描 >>', en: 'Re scan >>' },
        coupon403: {
            page_title: { zh: '优惠券核销', en: 'Coupon cancellation' },
            title: { zh: '无效的优惠券', en: 'Invalid coupons' },
            btm_btn: { zh: '返回首页', en: 'Back to home' },
        },
        coupon404: {
            page_title: { zh: '优惠券核销', en: 'Coupon cancellation' },
            title: { zh: '无权限核销该优惠券', en: 'Unauthorized to cancel the coupon' },
            btm_btn: { zh: '返回首页', en: 'Back to home' },
        }

    },

    //物资共享
    supplies: {
        borrowTitle: { zh: '物资共享', en:'Material sharing'},
        borrowStatus1: { zh: '申请中', en: 'application' },
        borrowStatus2: { zh: '出借中', en: 'lending' },
        borrowStatus4: { zh: '已归还', en: 'returned' },
        borrowStatus5: { zh: '已拒绝', en: 'rejected' },

        borrowGoods: { zh: '借用物品', en: 'borrow sth' },
        borrowNum: { zh: '借用数量', en: 'Borrowing quantity' },
        verifyBtn: { zh: '确认归还', en: 'Confirm return' },

        popTip1: { zh: '确认将物品借出？', en: 'Confirm to lend the item?' },
        popTip2: { zh: '确认拒绝该物品的申请？', en: 'Confirmation of rejection of the application for the item?' },
        popTip3: { zh: '确认该物品已经归还？', en: 'Confirm that the item has been returned?' },

        successTip: { zh: '借出成功', en: 'Loan success' },
        rejectTip: { zh: 'Rejected', en: '' },
        returnSuccessTip: { zh: '归还成功！', en: 'Return success!' },

    },

    //场地预定
    venue: {
        reserveTitle: { zh: '场地预定', en:'Site reservation'},
        myReserveTitle: { zh: '我的预定', en: 'My reservation' },

        statusName1: { zh: '申请中', en: 'application' },
        statusName2: { zh: '已通过', en: 'passed' },
        statusName3: { zh: '已完成', en: 'finish' },
        statusName9: { zh: '已拒绝', en: 'rejected' },
        reserveTime: { zh: '预定日期', en: 'Scheduled Date' },
        sumMoney: { zh: '总金额', en: 'Total sum' },
        passTime: { zh: '通过时间', en: 'Transit time' },

        popTip1: { zh: '确定同意将该场地预定的申请？', en: 'Determine the application for consent to reserve the site?' },
        popTip2: { zh: '确认拒绝该场地预定的申请？', en: 'Confirmation of rejection of the site reservation application?' },

        accommodate: { zh: '可容纳', en: 'It can accommodate ' },
        person: { zh: '人', en: ' people' },

        agreeTip: { zh: '同意预定！', en: 'Agree to reserve!' },
        rejectTip: { zh: '拒绝预定！', en: 'Refuse to book!' },
    },

    //投诉建议
    complaint: {
        title: { zh: '投诉建议', en: 'Suggestions' },
        subject: { zh: '主题', en: 'subject' },
        subjectPl: { zh: '请填写主题', en: 'Please fill in the subject' },
        subjectTip: { zh: '请输入主题！', en: 'Please enter the subject!' },
        feedback: { zh: '反馈结果', en: 'Feedback' },
        feedbackPl: { zh: '请输入您的反馈描述…', en: 'Please enter your feedback description...' },
        feedbackTip: { zh: '请输入反馈内容！', en: 'Please enter feedback!' },
        receiver: { zh: '受理人', en: 'Receiver' },
        addPicBtn: { zh: '添加图片', en: 'add pictures' },
        checkRecordBtn: { zh: '查看历史记录 >>', en: 'View history >>' },
        status1: { zh: '待处理', en: 'Untreated' },
        status2: { zh: '处理中', en: 'Processing' },
        status3: { zh: '已完成', en: 'completed' },
        applyTime: { zh: '发起时间：', en: 'Apply Time' },
        processTime: { zh: '受理时间：', en: 'Process Time' },
        finishTime: { zh: '完成时间：', en: 'Finish Time' },
        popTitle1: { zh: '处理投诉', en: 'Handling complaints' },
        popDes1: { zh: '确定处理该投诉吗？', en: 'Are you sure to handle the complaint?' },
        popTitle2: { zh: '投诉结果', en: 'Complaints result' },
        popDes2: { zh: '反馈的问题已解决！', en:'The feedback problem has been solved!'},
        btnName1: { zh: '我要处理', en: 'Handle' },
        btnName2: { zh: '处理好了', en: 'Well done' },
        operateTip1: { zh: '已受理！', en: 'Accepted!' },
        operateTip2: { zh: '已完成！', en: 'Completed!' }
    },

    //********** 组件 **********
    cpBacklog: {
        repairText: { zh: '报修', en: 'repair' },
        goodsText: { zh: '物资', en: 'material' },
        billText: { zh: '账单', en: 'order' },
        costText: { zh: '费用', en: 'Cost' },
        fixturesText: { zh: '装修', en: 'renovation' },
        pending: { zh: '待处理', en: 'Pending' },
        buildTip: { zh: '功能建设中，请到后台继续操作', en:'In the process of function construction, please go back to the background and continue to operate.'}
    },

    //底部菜单栏
    cpTab:{
        menuText1: { zh: '首页', en: 'Home' },
        menuText2: { zh: '消息', en: 'Message' },
        menuText3: { zh: '我的', en: 'User' },
    },

    //登录提示弹窗
    cpLoginTip:{
        tipText1: {
            zh: '您还没有登录园叮办公端的账号，\n登录后可享用园叮的所有服务！', en: "You haven't logged in to the account of Yuanding office. You can enjoy all the services of Yuanding after login." },
        loginBtn: { zh: '立即登录', en: 'Login' },
    },

    //有偿服务价格一览表
    cpServePricePop: {
        title: { zh: '有偿服务价格一览表', en:'Paid service price list'},
        cost: { zh: '人工费', en: 'Labor fee' },
        unit: { zh: '单位', en: 'unit' },
        explainText: { zh: '说明：\n1、未设收费标准项目可商议定价。\n2、上述收费标准中仅指人工费，全部不包含材料费。', en: 'Description：\n1、No fee standard items can be negotiated for pricing. \n2、The fee standard refers only to labor costs, and all materials are not included.' },
        iKnowBtn: { zh: '我知道了', en: 'I know' }
    }
}
