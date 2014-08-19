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

                // 如果是第一次进入验证
                if (this.frameCount == this.maxFrameNum) {
                    if (this.gesture.validateGestureStart(frame)) {

                        // 如果验证通过并且只有一帧，手势识别成功
                        if (!--this.frameCount) {
                            return true;
                        }

                        return false;
                    }
                }

                //如果next返回true，则继续倒计时
                //如果返回false，重置计时器
                //
                //直到计时器为0并且返回为true，则向接口返回true
/*
                // 如果是第一次进入验证
                if (this.frameCount == this.maxFrameNum) {

                    var result = ;
                    
                    // 如果验证通过并且只有一帧，手势识别成功
                    if (!--this.frameCount 
                        && this.gesture.validateGestureStart(frame) 
                        && this.gesture.validateGestureBasicCondition(frame)) {

                        return true;
                    } else {
                        return false;
                    }

                // 验证最后一帧
                } else if (this.frameCount == 1) {

                    // 此为最后一帧，无论验证成功或者失败，
                    // 都需要重置*计时器*，以便开始新的手势识别
                    this.frameCount = this.maxFrameNum; 

                    if (this.gesture.validateGestureEnd(frame) 
                        && this.gesture.validateGestureBasicCondition(frame)) {

                        return true; // 手势识别成功过
                    } else {
                        return false // 最后一帧验证未通过，手势识别失败
                    }

                // 验证其他帧数
                } else {

                    // 某一帧识别失败，此轮识别结束
                    // 重置*计时器*，以便下一帧开始进入下一轮
                    if (!this.gesture.validateGestureOnMove(frame) 
                        && this.gesture.validateGestureBasicCondition(frame)) {

                        this.frameCount = this.maxFrameNum; // RESET
                        return false;
                    } else {
                        this.frameCount--; // 成功，计数器即减一
                        return true;
                    }
                }
*/
            }
        }
    });

	return CommonStartProcedure;
})