define(["../apis/image",
        "../apis/notify"], 
function (ImageAPI, Notify) {
    
    function compute (a, b) {
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
                // Trigger lose signal
                return;
            }

            // 验证条件3：左手手掌不可以朝下
            // 也就意味着手掌方向于Y轴方向需要垂直（可以允许角度偏差正负不超过30度）
            var palmNormal = leftHand.palmNormal;
            var angle = compute(palmNormal, [0,-1,0]);

            if (Math.abs(angle - 90) > 30) {
                return;
            }


            if (rightHand.grabStrength != 0) {
                return;
            }

            if (rightHand.grabStrength == 0) {
                // Add some class
            }

            Notify.log("Translate Gesture Recognized!");

            var previousFrame = controller.frame(1);
            var movement = rightHand.translation(previousFrame);
            var rotationAroundZAxis = rightHand.rotationAngle(previousFrame, [0,0,1]);

            var deltaX = movement[0];
            var deltaY = movement[1];
            var deltaZ = movement[2];

            ImageAPI.threed.translate(deltaX, deltaY, deltaZ);
        } else {
            // Gesture recognized failed!
        }
    }

    return entry
});