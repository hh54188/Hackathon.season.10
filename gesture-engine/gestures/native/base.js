define(function () {
	return checkGesture: function (frame, type) {

        var gestures = frame.gestures;

        if (gestures.length) {
            gestures.forEach(function (gesture) {
                if (gesture.type == type) {
                    return true;
                }
            });
        }
        
        return false;
	}
})