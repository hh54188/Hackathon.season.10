define (["validate_flow/BaseFlow"], function (BaseFlow) {

	function CommonFlow (gesture) {

		this.MAX_FRAME_NUM = 15;

		this.gesture = gesture;
		this.currentFrameCount = 0;
		this.frameQueue = [];

		this.isRecognitionStarted = false;
	}

	CommonFlow.prototype = Object.create(BaseFlow.prototype, {

		reset: {
			value: function () {

				this.isRecognitionStarted = false;
				this.frameQueue.length = 0;
				this.gesture.reset();
			}
		},

		validate: {
			value: function (frame) {
				
				var gesture = this.gesture;
				this.frameQueue.push(frame);

				if (!this.isRecognitionStarted) {

					if (gesture.validateGestureStart(frame)) {
						this.isRecognitionStarted = true;
						this.currentFrameCount = 1;
					}

				} else {

					this.currentFrameCount++;

					if (this.currentFrameCount == this.MAX_FRAME_NUM) {
						this.reset();
						if (gesture.validateGestureEnd(frame)) {
							return true;
						}
					}

					
					if (!gesture.validateGestureOnMove(frame) || 
						!gesture.validateGestureBasicCondition(frame)) {

						this.reset();
					}
				}

				return false;
			}
		}
	});

	return CommonFlow;
});