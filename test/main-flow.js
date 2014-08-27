requirejs.config({
    baseUrl: '../gesture-engine/gestures'
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

require(["custom/TestGesture"], function (TestGesture) {

	var testGesture = new TestGesture;

	function validateTestFrame (frames) {

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
	    				break;
	    			}
	    		} else if (i > head && i < tail) {
	    			if (testGesture.validateGestureOnMove(frames[i]) && 
	    				testGesture.validateGestureBasicCondition(frames[i])) {
	    				continue;
	    			} else {
	    				break;
	    			}
	    		} else if (i == tail) {
	    			if (testGesture.validateGestureEnd(frames[i])) {
	    				hitted.push(i + ":" + frames[i]);
	    				continue;
	    			} else {
	    				break;
	    			}	    			
	    		}
	    	}

	    	head++, tail++;
	    }

	    return hitted;
	}

	function assert (actual, expected, message) {
		
		if (actual == expected) {
			console.log("SUCCESS:", message);
		} else {
			console.error("FAILED:", message);
		}
	}

	var testCases = [
		// {
		// 	frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
		// 	description: "Gesture recognized"
		// },
		// {
		// 	frames: [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19],
		// 	description: "Failed at frist two frame"
		// },
		{
			frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17]
					.concat([19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36]),
			description: "Failed at last frame"
		}
	];


	testCases.forEach(function (testCase) {

		(function (frames, description) {
			debugger
			var result = [];
			frames.forEach(function (frame, index) {
				if (testGesture.validate(frame)) {
					result.push(index + ":" + frame);
				}
			});
			var foo = validateTestFrame(frames);
			var bar = result;
			debugger
			assert(validateTestFrame(frames).join(""), result.join(""), description);

		})(testCase.frames, testCase.description);

	});

});