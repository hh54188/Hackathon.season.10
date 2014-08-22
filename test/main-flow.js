requirejs.config({
    baseUrl: '../gesture-engine/gestures',
    paths: {
        BaseGesture: 'basic/BaseGesture'
    }
});


/*
	
	测试思路：

	需要验证三种情况：
	1. 手势通过
	2. 挂在初始验证
	3. 挂在移动验证
		4. 挂在基本手势
	5. 挂在结束验证

	需要5个数组，每个数组15个长度的帧

	注意：这个测试只能够用来验证validateflow。
	但是内部的procedure不能验证，因为只能返回flow只能返回true或false，
	不能分别究竟在哪一个procedure退出的
	（手势验证只能等待实战了）

	测试用例设计：

	测试frame值

	start：奇数
	onMove: 递增序列
	basic: 在1到100之间
	end：偶数

	1. 通过: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16]
	2. 挂在初始验证阶段：[2]
	3. 挂在移动阶段：[1, 5, 4]
	4. 挂在基本识别：[1, 101]
	5. 挂在结束验证：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

 */

require(["BaseGesture"], function (BaseGesture) {

	// 定义测试手势
	var TestGesture = function () {

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
		}
	});

	var testGesture = new TestGesture;

	// 测试在初始阶段挂掉
	var casePassed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];

	casePassed.forEach(function (frame) {
		var result = testGesture.validate(frame);
		console.log(result);
	});

});