define(["validateFlow/CommonFlow"], function (CommonFlow) {

    function emptyFn () {
        return true;
    }

    function BaseGesture () {
        
    }

    BaseGesture.prototype = {

        ValidateFlowConstructor: CommonFlow,

        // 检测手势是否识别开始 
        validateGestureStart: emptyFn,

        // 识别手势是否结束 
        validateGestureEnd: emptyFn,

        // 检测手势在移动过程中是否正确
        validateGestureOnMove: emptyFn,

        // 检测手势是否保持基础状态
        validateGestureBasicCondition: emptyFn,

        // 重置
        reset: emptyFn,

        validate: function (frame) {
            return this.validateFlow.validate(frame);
        }
    }

    return  BaseGesture;
});