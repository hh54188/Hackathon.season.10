define(function () {

    return {
        checkGesture: function (frame) {
            var gestures = frame.gestures;

            if (gestures.length) {
                for (var i = 0; i < gestures.length; i++) {
                    if (gestures[i].type == "circle") {
                        return true;
                    }                    
                }
            }

            return false;
        },
        eventName: "circle"
    }
});