define(["validateProcedure/BaseProcedure"], function (BaseProcedure) {

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
                
                

                // 如果是第一次进入验证
                if (this.frameCount == this.maxFrameNum) {

                    this.frameCount--;
                    if (this.gesture.validateGestureStart(frame)) {

                        // 如果验证通过并且只有一帧，手势识别成功
                        if (!this.frameCount) {
                            return true;
                        }
                        return false;
                    } else {
                        this.frameCount = this.maxFrameNum;
                        return false;
                    }
                }

                this.frameCount--;
                var nextResult = this.validateNext(frame);

                // 如果下一个环节执行结果为true，并且倒计时完毕
                // 则手势验证完毕
                if (nextResult && !this.frameCount) {
                    return true;

                // 如果下一个执行结果为true，则继续倒计时
                } else if (nextResult) {
                    return false;

                // 如果下一个环节执行返回为false，则需要重新开始
                } else if (!nextResult) {

                    this.frameCount = this.maxFrameNum;
                    return false;
                }
            }
        }
    });

	return CommonStartProcedure;
})