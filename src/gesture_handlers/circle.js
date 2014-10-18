define(["../apis/wall"], function (WAPI) {

	var lastTimestamp = 0;
	var MAX_INTERVAL = 1000 * 2;
	var ENABLE = false;

	function checkTimeInterval () {
		var flag;
		var curTime = +new Date();
		if (!lastTimestamp || curTime - lastTimestamp > MAX_INTERVAL) {
			flag = true;
		} else {
			flag = false;
		}
		return flag;
	}

	function haveGesture (frame, name) {
		for(var g = 0; g < frame.gestures.length; g++){
		    var gesture = frame.gestures[g];
		    if (gesture.type == name) {
		    	return true;
		    }
		}
		return false;
	}

	function longValidate (control) {
		var frameNeed = 30;
		for (var i = 1; i <= frameNeed; i++) {
			if (!haveGesture(control.frame(i), "circle")) {
				return false;
			}
		}

		return true;
	}

	function entry (control, frame) {

		// 如果没有超过时间间隔
		var checkIntervalResult = checkTimeInterval();
		if (!checkIntervalResult) {
			return false;
		}

		if (longValidate(control)) {
			// 如果启用，则关闭
			if (ENABLE) {
				console.debug("DISENABLE WALL!");
				lastTimestamp = +new Date();
				WAPI.destory();
				ENABLE = false;
				window.ENABLE_WALL = false;
			// 如果未开启，则启用
			} else {
				console.debug("ENABLE WALL!");
				lastTimestamp = +new Date();
				WAPI.init();
				ENABLE = true;	
				window.DISENABLE_WALL = true;
			}

		}

	}

	return entry; 
}); 