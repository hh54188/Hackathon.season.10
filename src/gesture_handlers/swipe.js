/*
    Gesture data structure:
    {
        direction: [],
        duration: ,
        handIds: ,
        id: ,
        pointableIds: [],
        position: [],
        startPosition: [],
        state: "stop",
        type: "swipe"
    }
 */

define(function () {

	var PROCESSING = false;

	function _callback (gestureInfo) {

	}

	function entry (gestureInfo) {
		if (PROCESSING) {
			return;
		}

		PROCESSING = true;

		try {
			_callback(gestureInfo);
		} catch (e) {

		}
		
		PROCESSING = false;
	}

	return entry;
});