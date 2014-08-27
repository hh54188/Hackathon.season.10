/*
	
	# 测试目的：

	测试架构设计正确

	# 测试思路：

	需要验证五种情况：
	1. 成功：手势通过
	2. 失败：挂在初始验证
	3. 失败：挂在移动验证
	4. 失败：挂在基本手势
	5. 失败：挂在结束验证


	# 测试用例设计：

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

requirejs.config({
    baseUrl: '../gesture-engine/gestures'
});


require(["custom/TestGesture"], function (TestGesture) {

	function validateTestFrame (frames) {

		var testGesture = new TestGesture;

	    // 指针
	    var maxFrame = 15;

	    var hitted = [];
	    var count = 0;

	    for (var i = 0; i < frames.length; i++) {

	    	var frame = frames[i];
    		count++;

			if (count == 1) {

    			if (!testGesture.validateGestureStart(frame)) {
	    			count = 0;
	    		}

	    	} else if (count > 1 && count < maxFrame) {

    			if (!testGesture.validateGestureOnMove(frame) || 
    				!testGesture.validateGestureBasicCondition(frame)) {
    				count = 0;
    			}

	    	} else if (count == maxFrame) {

	    		if (testGesture.validateGestureEnd(frame)) {
	    			hitted.push(i + ":" + frames[i]);
	    		} else {
	    			count = 0;
	    		}
    		}	    	
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
		{
			frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
			description: "Gesture recognized"
		},
		{
			frames: [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19],
			description: "Failed at frist two frame"
		},
		{
			frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
					.concat([19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36]),
			description: "Failed at last frame"
		},
		{
			frames: [1, 2, 3, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
			description: "Failed at move condition"
		},
		{
			frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 10001, 10002],
			description: "Failed at basic condition"
		}
	];


	testCases.forEach(function (testCase) {

		(function (frames, description) {

			var result = [];
			var testGesture = new TestGesture;

			frames.forEach(function (frame, index) {
				if (testGesture.validate(frame)) {
					result.push(index + ":" + frame);
				}
			});

			var expected = validateTestFrame(frames);
			var actual = result;

			assert(expected.join(""), actual.join(""), description);

		})(testCase.frames, testCase.description);

	});

});