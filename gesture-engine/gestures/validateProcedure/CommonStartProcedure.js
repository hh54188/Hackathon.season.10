define(["base"], function (BaseProcedure) {

	function CommonStartProcedure (gesture, nextProcedure) {

        this.frameCount = this.maxFrameNum; //  计数器，用于判断流程是否验证完毕
        this.startFrameNum = this.endFrameNum = 1;
        this.moveFrameNum= this.frameCount - this.startFrameNum - this.endFrameNum;

        this.gesture = gesture;
		this.successor = nextProcedure || null;
	}

	CommonStartProcedure.prototype = Object.create(BaseProcedure, {

        validate: {
            value: function (frame) {

                if (this.frameCount == this.maxFrameNum) {
                    if (this.gesture.validateGestureStart(frame)) {
                        
                        // 只需要验证一帧即可
                        // 比如手势：手掌朝上
                        if (!--this.frameCount) {
                            return true;
                        }

                        var nextResult = this.validateNext(frame);
                        if (nextResult) {
                            // 如果最后一帧也验证完毕
                            if (!--this.frameCount) {
                                return true;
                            }
                        }

                    } else {

                    }
                }

            }
        }
    });

	return CommonStartProcedure;
})