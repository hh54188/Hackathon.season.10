define(["../apis/image",
        "../apis/notify"/*, 
        "../apis/crop"*/], 
function (ImageAPI, Notify) {

    var leftHand, rightHand;
    
    // function computeAngle (a, b) {
    //     // 空间向量夹角计算：http://www.cnblogs.com/crazyac/articles/1991957.html
    //     var cos = Math.acos(Leap.vec3.dot(a, b) / (Leap.vec3.len(a) * Leap.vec3.len(b)));
    //     var angle = (cos / Math.PI) * 180;

    //     return angle;
    // }

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

            // // 验证条件3：左手手掌不可以朝下
            // // 也就意味着手掌方向于Y轴方向需要垂直（可以允许角度偏差正负不超过30度）
            // var palmNormal = leftHand.palmNormal;
            // var angle = computeAngle(palmNormal, [0,-1,0]);

            var previousFrame = controller.frame(1);
            var movement = rightHand.translation(previousFrame);

            var deltaX = movement[0];
            var deltaY = movement[1];
            var deltaZ = movement[2];

            ImageAPI.threed.translate(deltaX, deltaY, deltaZ);
        }
    }

    return entry
});