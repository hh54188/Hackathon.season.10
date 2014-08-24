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
                var validateResult;

                // 验证最后一帧
                if (!this.frameCount) {

                    nextResult = this.validateNext(frame);
                    if (nextResult) {
                        return true;
                    } else {
                        return false;
                    }

                } else {

                    nextResult = gesture.validateGestureOnMove(frame) && 
                                    gesture.validateGestureBasicCondition(frame);
                    // 验证失败
                    if (!nextResult) {
                        console.log("MOVE PROCEDURE FAILED", frame);
                        this.resetFrameCount();
                        return false;                        
                    } else {
                        return true;
                    }
                }
            }
        }
    });

    return CommonMoveProcedure;
});