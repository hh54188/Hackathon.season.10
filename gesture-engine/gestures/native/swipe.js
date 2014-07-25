define(["base"], function (nativeGestureCheck) {

    var gestureName = "swipe";
    return {
        checkGesture: function (frame) {
            nativeGestureCheck(frame, gestureName);
        },
        eventName: gestureName
    }
});