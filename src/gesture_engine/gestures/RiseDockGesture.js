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
			return false;
		}

		if (!controller) return false;

		if (frame.hands.length 
			&& frame.hands.length == 1
			&& frame.hands[0].type == "right") {

			var rightHand = frame.hands[0];
			var fingers = rightHand.fingers;

			thumb = fingers[0];
			index = fingers[1];
			middle = fingers[2];
			ring = fingers[3];
			pinky = fingers[4];

			var thumbAngle = computeAngle(thumb.direction, [0, -1, 0]);
			var indexAngle = computeAngle(index.direction, [0, -1, 0]);
			var middleAngle = computeAngle(middle.direction, [0, -1, 0]);
			var ringAngle = computeAngle(ring.direction, [0, -1, 0]);
			var pinkyAngle = computeAngle(pinky.direction, [0, -1, 0]);
			 
			if (Math.abs(90 - thumbAngle) < 20
				&& Math.abs(90 - indexAngle) < 20
				&& middleAngle < 30
				&& ringAngle < 30
				&& Math.abs(90 - pinkyAngle) < 20
				) {

				lastTimestamp = +new Date();
				return true;
			}
		}

		return false;
	}

	return RiseDockGesture;
});