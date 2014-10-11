define(function () {

	var rightHand, leftHand;
	var prevRightHand, prevLeftHand;

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

		if (!controller) return false;

		if (frame.hands.length && frame.hands.length == 2) {

			rightHand = getHands(frame).rightHand;
			leftHand = getHands(frame).leftHand;

			var previousFrame = controller.frame(10); // 与前十帧进行比较，这里可以自动调节
			if (!previousFrame.hands.length || previousFrame.hands.length != 2) {
				return false;
			}
			prevRightHand = getHands(previousFrame).rightHand;
			prevLeftHand = getHands(previousFrame).leftHand;

			if (rightHand.palmPosition[1] > prevRightHand.palmPosition[1]) {
				return true;
			}

		}
		return false;
	}

	return RiseDockGesture;
});