define(["validateProcedure/BaseProcedure"], function (BaseProcedure) {

    function CommonMoveProcedure (gesture, nextProcedure) {

        this.resetFrameCount();

        this.gesture = gesture;
        this.successor = nextProcedure || null;
    }

    CommonMoveProcedure.prototype = Object.create(BaseProcedure, {

        resetFrameCount: {
            value: function (frame) {
                this.frameCount = this.maxFrameNum - 2;
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