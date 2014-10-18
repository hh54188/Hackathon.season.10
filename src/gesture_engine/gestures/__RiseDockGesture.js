define(function () {

	var rightHand, leftHand;
	var prevRightHand, prevLeftHand;
	var lastTimestamp = 0;
	var MAX_INTERVAL = 1000 * 3; // 升起手势最大事件间隔3S
	var COMPARE_FRAME = 5;

	function checkTimeInterval () {
		var flag;
		var curTime = +new Date();
		if (!lastTimestamp || curTime - lastTimestamp > MAX_INTERVAL) {
			flag = true;
		} else {
			flag = false;
		}
		return flag;

	}

	function computeAngle (a, b) {
        // 空间向量夹角计算：http://www.cnblogs.com/crazyac/articles/1991957.html
        var cos = Math.acos(Leap.vec3.dot(a, b) / (Leap.vec3.len(a) * Leap.vec3.len(b)));
        var angle = (cos / Math.PI) * 180;

        return angle;
    }

    function getHands (frame) {

    	var hands = {};

		if (frame.hands[0].type == "right") {

            hands.rightHand = frame.hands[0];
            hands.leftHand = frame.hands[1];
        } else {

            hands.rightHand = frame.hands[1];
            hands.leftHand = frame.hands[0];
        }

    	return hands;
    }

	function RiseDockGesture () {

	}

	RiseDockGesture.prototype.validate = function (controller, frame) {

		var checkIntervalResult = checkTimeInterval();
		// 如果为真，则代表允许继续验证
		// 如果为假，则还在没有超过两个手势的最大的时间间隔
		if (!checkIntervalResult) {
			return;
		}

		if (!controller) return false;

		// 验证条件：必须存在双手
		if (frame.hands.length && frame.hands.length == 2) {

			rightHand = getHands(frame).rightHand;
			leftHand = getHands(frame).leftHand;

			var previousFrame = controller.frame(COMPARE_FRAME); // 与前十帧进行比较，这里可以自动调节
			if (!previousFrame.hands.length || previousFrame.hands.length != 2) {
				return false;
			}
			prevRightHand = getHands(previousFrame).rightHand;
			prevLeftHand = getHands(previousFrame).leftHand;

			// 验证条件：右手高度必须高于前十帧
			if ((rightHand.palmPosition[1] > prevRightHand.palmPosition[1])
				// 验证条件：左手高度必须高于前十帧
				&& (leftHand.palmPosition[1] > prevLeftHand.palmPosition[1])
				// 验证条件：双手手掌朝下
				&& Math.abs(computeAngle(leftHand.palmNormal, [0,-1,0])) < 20
				// && Math.abs(computeAngle(rightHand.palmNormal, [0,-1,0])) < 20
				) {
				lastTimestamp = +new Date();
				return true;
			}

		}
		return false;
	}

	return RiseDockGesture;
});