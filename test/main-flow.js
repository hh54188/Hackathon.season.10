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

	function testValidate (frames) {

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

	function assert () {
		
	}


	(function () {

		var testFrames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];
		var result = [];

		testFrames.forEach(function (frame, index) {

			if (testGesture.validate(frame)) {
				result.push(index + ":" + frame);
			}
		});

		console.log(result.join(""));
		console.log(validate(testFrames).join(""));

	})();




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