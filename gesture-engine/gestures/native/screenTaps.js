define(["base"], function (nativeGestureCheck) {

    var gestureName = "screenTap";
    return {
        checkGesture: function (frame) {
            nativeGestureCheck(frame, gestureName);
        },
        eventName: gestureName
    }
});