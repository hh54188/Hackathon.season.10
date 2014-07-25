define(["base"], function (nativeGestureCheck) {

    var gestureName = "keyTap";
    return {
        checkGesture: function (frame) {
            nativeGestureCheck(frame, gestureName);
        },
        eventName: gestureName
    }
});