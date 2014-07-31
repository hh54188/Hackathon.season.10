define(function () {

    return {
        checkGesture: function (frame) {
            var gestures = frame.gestures;

            if (gestures.length) {
                gestures.forEach(function (gesture) {
                    if (gesture.type == "swipe") {
                        return true;
                    }
                });
            }

            return false;
        },
        eventName: "circle"
    }
});