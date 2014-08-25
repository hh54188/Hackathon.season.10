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
		},

		reset: {
			value: function () {
				this.lastFrame = 0;
			}
		}
	});

	var testGesture = new TestGesture;

	var frames = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17];

	function validate (frames) {

	    // 指针
	    var delta = 15,
	        head = 0,
	        tail = head + delta - 1;

	    var hitted = [];

	    while (tail <= frames.length - 1) {

	    	for (var i = head; i <= tail; i++) {

	    		if (i == head) {
	    			if (testGesture.validateGestureStart(frames[i])) {
	    				continue;
	    			} else {
	    				console.log("START FAILED");
	    				break;
	    			}
	    		} else if (i > head && i < tail) {
	    			if (testGesture.validateGestureOnMove(frames[i]) && 
	    				testGesture.validateGestureBasicCondition(frames[i])) {
	    				continue;
	    			} else {
	    				console.log("MOVE FAILED");
	    				break;
	    			}
	    		} else if (i == tail) {
	    			if (testGesture.validateGestureEnd(frames[i])) {
	    				hitted.push(i + ":" + frames[i]);
	    				continue;
	    			} else {
	    				console.log("END FAILED");
	    				break;
	    			}	    			
	    		}
	    	}

	    	head++, tail++;
	    }

	    return hitted;
	}

	console.log(validate(frames));

	// 通过
	// console.log("------PASSED CASE START------");

	// var casePassed1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];
	// casePassed1.forEach(function (frame) {
	// 	var result = testGesture.validate(frame);
	// 	console.log(result);
	// });

	// console.log("------PASSED CASE END------");




	// 2. 挂在初始验证阶段：[2]
	// 不通过
	// console.log("------FAILED CASE START: failed at start valdiate procedure------");

	// var casePassed2 = [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];
	// casePassed2.forEach(function (frame) {
	// 	var result = testGesture.validate(frame);
	// 	console.log(result);
	// });

	// console.log("------FAILED CASE END------");




	// 3. 挂在移动阶段：[1, 5, 4]
	// 不通过
	// console.log("------FAILED CASE START: failed at move valdiate procedure------");

	// var casePassed3 = [1, 5, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];
	// casePassed3.forEach(function (frame) {
	// 	var result = testGesture.validate(frame);
	// 	console.log(result);
	// });

	// console.log("------FAILED CASE END------");



	
	// 4. 挂在基本识别：[1, 101]
	// 不通过
	// console.log("------FAILED CASE START: failed at basic valdiate procedure------");

	// var casePassed4 = [1, 101, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];	
	// casePassed4.forEach(function (frame) {
	// 	var result = testGesture.validate(frame);
	// 	console.log(result);
	// });

	// console.log("------FAILED CASE END------");




	// 5. 挂在结束验证：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
	// 不通过
	// console.log("------FAILED CASE START: failed at end valdiate procedure------");	

	// var casePassed5 = [1, 2, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	// casePassed5.forEach(function (frame) {
	// 	var result = testGesture.validate(frame);
	// 	console.log(result);
	// });

	// console.log("------FAILED CASE END------");
});