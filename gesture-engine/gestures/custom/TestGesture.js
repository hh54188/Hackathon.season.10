define(["BaseGesture"], function (BaseGesture) {

	// 定义测试手势
	function TestGesture() {

		this.validateFlow = new this.ValidateFlowConstructor(this);
	};

	TestGesture.prototype = Object.create(new BaseGesture, {

		// 成功条件：frame为奇数
		validateGestureStart: {
			value: function (frame) {

				if (frame % 2 != 0) {
					return true;
				}
				return false;
			}
		},

		// 成功条件：frame为偶数
		validateGestureEnd: {
			value: function (frame) {

				if (frame % 2 == 0) {
					return true;
				}
				return false;
			}
		},

		// 成功条件：逐渐递增
		validateGestureOnMove: {
			value: function (frame) {

				this.lastFrame = this.lastFrame || 0;

				if (frame > this.lastFrame) {
					this.lastFrame = frame;
					return true;
				}

				this.lastFrame = frame;
				return false;
			}
		},

		// 成功条件：在1至100之间（包括等于100）
		validateGestureBasicCondition: {
			value: function (frame) {
				if (frame >= 1 && frame <= 100) {
					return true;
				}
				return false;
			}
		},

		reset: {
			value: function () {
				this.lastFrame = 0;
			}
		}
	});

	return TestGesture;
});