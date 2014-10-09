define(function () {

	var rightHand, leftHand;

	function computeAngle (a, b) {
        // 空间向量夹角计算：http://www.cnblogs.com/crazyac/articles/1991957.html
        var cos = Math.acos(Leap.vec3.dot(a, b) / (Leap.vec3.len(a) * Leap.vec3.len(b)));
        var angle = (cos / Math.PI) * 180;

        return angle;
    }

	function TranslateGesture () {

	}

	TranslateGesture.prototype.validate = function  (controller, frame) {

		if (!controller) return false;

		var hands = frame.hands;

		if (frame.hands.length && frame.hands.length == 2) {

            // 验证条件1.两只手必须同时存在
            // frame.hands的秩序由手进入设备的顺序决定
            if (frame.hands[0].type == "right") {

                rightHand = frame.hands[0];
                leftHand = frame.hands[1];
            } else {

                rightHand = frame.hands[1];
                leftHand = frame.hands[0];
            }

            // 验证条件2：左手的Z轴坐标必须小于右手Z轴
            if (leftHand.palmPosition[2] > rightHand.palmPosition[2]) {
                return false;
            }            

            // 验证条件3：左手手掌不可以朝下
            // 也就意味着手掌方向于Y轴方向需要垂直（可以允许角度偏差正负不超过30度）
            var palmNormal = leftHand.palmNormal;
            var angle = computeAngle(palmNormal, [0,-1,0]);            

            if (Math.abs(angle - 90) > 30) {
                return false;
            }


            if (rightHand.grabStrength != 0) {
                return false;
            }

            // if (rightHand.grabStrength == 0) {
                
            // }

            return true;
		}

		return false;
	};

	return TranslateGesture;
});