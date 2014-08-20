define(["base"], function (BaseProcedure) {

    function CommonMoveProcedure (gesture, nextProcedure) {

        this.resetFrameCount();

        this.gesture = gesture;
        this.successor = nextProcedure || null;
    }

    CommonMoveProcedure.prototype = Object.create(BaseProcedure, {

        // 注意，这个规则是否正确？
        resetFrameCount: {
            value: function (frame) {

                this.frameCount = this.maxFrameNum;
            }
        },

        validate: {
            value: function (frame) {

                this.frameCount--;
                var gesture = this.gesture;

                // 手势验证不通过
                if (!gesture.validateGestureOnMove(frame) 
                        || !gesture.validateGestureBasicCondition(frame)) {

                    this.resetFrameCount();
                    return false;
                }

                // When to triger the next procedure ?
                if (!this.frameCount) {
                    var nextResult = this.validateNext(frame);
                    if (nextResult) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    var selfResult = this.validateSelf(frame);
                    if (selfResult) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    });

    return CommonMoveProcedure;
});