define(["../apis/image",
        "../apis/notify"], 
function (ImageAPI, Notify) {

	var leftHand, rightHand, previousRightHand;

	function computeAngle (a, b) {
        // 空间向量夹角计算：http://www.cnblogs.com/crazyac/articles/1991957.html
        var cos = Math.acos(Leap.vec3.dot(a, b) / (Leap.vec3.len(a) * Leap.vec3.len(b)));
        var angle = (cos / Math.PI) * 180;

        return angle;
    }

	function entry (controller, frame) {
        if (!controller) {
            return;
        }

        if (frame.hands.length && frame.hands.length == 2) {

            // frame.hands的秩序由手进入设备的顺序决定
            if (frame.hands[0].type == "right") {

                rightHand = frame.hands[0];
                leftHand = frame.hands[1];
            } else {

                rightHand = frame.hands[1];
                leftHand = frame.hands[0];
            }

			var previousFrame = controller.frame(1);
			if (!previousFrame.hands 
				|| previousFrame.hands.length != 2) {

				return false;
			}

			// 需要验证验证前一帧是否需要符合手势（暂时忽略）

			// 找出前一帧右手
            if (previousFrame.hands[0].type == "right") {
                previousRightHand = previousFrame.hands[0];
            } else {
                previousRightHand = previousFrame.hands[1];
            }

			var previousAngleZ = (previousRightHand.roll() / Math.PI) * 180 * (-1);
			var angleZ = (rightHand.roll() / Math.PI) * 180 * (-1);
			var deltaAngle = angleZ - previousAngleZ;

            ImageAPI.threed.rotate(deltaAngle);
        }
	}

	return entry;
});