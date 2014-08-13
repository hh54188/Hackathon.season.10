define(["../validateFlow/commonFlow"], function (CommonFlow) {

    function emptyFn () {
        return true;
    }

    function BaseGesture () {

        this.validateFlow = new CommonFlowd(this);
    }

    BaseGesture.prototype = {

        // 检测手势是否识别开始 
        validateGestureStart: emptyFn,

        // 识别手势是否结束 
        validateGestureEnd: emptyFn,

        // 检测手势在移动过程中是否正确
        validateGestureOnMove emptyFn,

        // 检测手势是否保持基础状态
        validateGestureBasicCondition: emptyFn
    }

    return  BaseGesture;
});