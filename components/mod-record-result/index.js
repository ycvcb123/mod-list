//菜单相关功能
var menuHandle = {
    //菜单功能
    ontouchstart: function(e) {
        //搜索结果不需要菜单功能
        if (!this.data.useCacheFlag) {
            return
        }
        //菜单选项点击时，直接删除，不触发任何多余动作
        var isMenu = e.target.dataset.type === 'menu';
        if (isMenu) {
            return;
        }
        if (this.showState === 1 && !isMenu) {
            this.showState = 0;
            this.translateXMsgItem(this.lastShowMsgId, 0, 500);
            this.lastShowMsgId = "";
        }
        this.firstTouchX = e.touches[0].clientX;
        this.firstTouchY = e.touches[0].clientY;
        if (this.firstTouchX > 35) {
            this.swipeCheckState = 1;
        }
    },
    ontouchmove: function(e) {
        //搜索结果不需要菜单功能
        if (!this.data.useCacheFlag) {
            return
        }
        var isMenu = e.target.dataset.type === 'menu';
        if (isMenu) {
            return;
        }
        if (this.swipeCheckState === 0) {
            return;
        }
        var moveX = e.touches[0].clientX - this.firstTouchX;
        var moveY = e.touches[0].clientY - this.firstTouchY;
        //已触发垂直滑动，由scroll-view处理滑动操作
        if (this.swipeDirection === 2) {
            return;
        }
        //未触发滑动方向
        if (this.swipeDirection === 0) {
            //触发垂直操作
            if (Math.abs(moveY) > 4) {
                this.swipeDirection = 2;
                return;
            }
            //触发水平操作
            if (Math.abs(moveX) > 4) {
                this.swipeDirection = 1;
                this.setData({ scrollY: false });
            } else {
                return;
            }
        }
        //处理边界情况
        if (moveX > 0) {
            moveX = 0;
        }
        //检测最大左滑距离
        if (moveX < -this.maxMoveLeft) {
            moveX = -this.maxMoveLeft;
        }
        this.moveX = moveX;
        this.translateXMsgItem(e.currentTarget.id, moveX, 0);
    },
    ontouchend: function(e) {
        //搜索结果不需要菜单功能
        if (!this.data.useCacheFlag) {
            return
        }
        var isMenu = e.target.dataset.type === 'menu';
        if (isMenu) {
            return;
        }
        this.swipeCheckState = 0;
        var swipeDirection = this.swipeDirection;
        this.swipeDirection = 0;
        this.setData({ scrollY: true });
        //垂直滚动，忽略
        if (swipeDirection !== 1) {
            return;
        }
        if (this.moveX === 0) {
            this.showState = 0;
            //不显示菜单状态下,激活垂直滚动
            this.setData({ scrollY: true });
            return;
        }
        if (this.moveX === this.correctMoveLeft) {
            this.showState = 1;
            this.lastShowMsgId = e.currentTarget.id;
            return;
        }
        if (this.moveX < -75) {
            this.moveX = -this.correctMoveLeft;
            this.showState = 1;
            this.lastShowMsgId = e.currentTarget.id;
        } else {
            this.moveX = 0;
            this.showState = 0;
            //不显示菜单,激活垂直滚动
            this.setData({ scrollY: true });
        }
        this.translateXMsgItem(e.currentTarget.id, this.moveX, 500);
    },
    getItemIndex: function(id) {
        var msgList = this.data.list;
        for (var i = 0; i < msgList.length; i++) {
            if (msgList[i].id === id) {
                return i;
            }
        }
        return -1;
    },
    deleteMsgItem: function(e) {
        console.log(e);
        var that = this;
        var index = that.getItemIndex(e.currentTarget.id);
        that.translateXMsgItem(e.currentTarget.id, 0, 0, function() {
            that.data.list.splice(index, 1);
            that.setData({ list: that.data.list });
            that.showState = 0;
        });
    },
    upToNo1: function(e) {
        var that = this;
        var index = that.getItemIndex(e.currentTarget.id);
        that.translateXMsgItem(e.currentTarget.id, 0, 0, function() {
            var temp = that.data.list[index];
            that.data.list.splice(index, 1);
            that.data.list.unshift(temp);
            that.setData({ list: that.data.list });
            that.showState = 0;
        });
    },
    translateXMsgItem: function(id, x, duration, callback) {
        var animation = wx.createAnimation({ duration: duration });
        animation.translateX(x).step();
        this.animationMsgItem(id, animation, callback);
    },
    animationMsgItem: function(id, animation, callback) {
        var that = this;
        var index = this.getItemIndex(id);
        var param = {};
        var indexString = 'list[' + index + '].animation';
        param[indexString] = animation.export();
        this.setData(param, () => {
            callback && callback();
        });
    },

    /**
     *精准获取srcoll-view高度
     * @param  {[Array]} param [需要参与减法的元素class名]
     * @param {[Number]} marginNum [外边距的值的总和： 不推荐使用（边距尽量用view来撑开）]
     */
    computeScrollViewH: function(param, marginNum = 0, that) {
        // 获取手机头部导航高度
        var navHeight;
        wx.getSystemInfo({
            success: res => {
                navHeight = res.statusBarHeight + 46;
            },
            fail(err) {
                console.log(err);
            }
        });

        var screenHeight = wx.getSystemInfoSync().screenHeight;
        var allHeight = 0;
        var scrollHeight = 0;
        var query = wx.createSelectorQuery().in(that);
        param.map(item => {
            console.log(item)
            query.select(item).boundingClientRect();
        });
        query.exec(res => {
            res.map(item => {
                allHeight += item.height;
            });
            scrollHeight = screenHeight - allHeight - marginNum - navHeight;
            that.setData({
                scrollHeight: `${scrollHeight}px`
            });
        });
    }
};

Component({
    properties: {
        scrollHeight: {
            type: String,
            value: ''
        },
        list: {
            type: Array,
            value: []
        }
    },
    data: {
        scrollHeight: '',
        list: [],
        scrollY: true,
        searchKey: '',
        useCacheFlag: true
    },
    created() {
        //菜单相关
        this.swipeCheckState = 0;
        this.maxMoveLeft = 160;
        this.correctMoveLeft = 160;
        this.lastShowMsgId = '';
        this.moveX = 0;
        this.showState = 0;
        this.swipeDirection = 0;
        this.computeScrollViewH([], 0, this);
    },
    methods: Object.assign({}, menuHandle)
});