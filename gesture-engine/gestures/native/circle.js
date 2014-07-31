define(["base"], function (nativeGestureCheck) {

    var gestureName = "circle";
    return {
        checkGesture: function (frame) {
            nativeGestureCheck(frame, gestureName);
        },
        eventName: gestureName
    }
});