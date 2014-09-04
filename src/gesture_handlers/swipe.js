/*
    Gesture data structure:

    https://developer.leapmotion.com/documentation/skeletal/javascript/api/Leap.SwipeGesture.html#SwipeGesture
   
    {
        direction: [], // a 3-element array representing a unit direction vector.
        duration: , // The elapsed duration of the recognized movement up to the frame, in microseconds.
        handIds: , // The list of the ids for the hands
        id: , // The gesture ID. (Why need gesture ID?)
        pointableIds: [], // The list of ids for the fingers and tools associated with this Gesture,
        position: [], // The current swipe position within the Leap frame of reference, in mm.
        speed: , // The speed of the finger performing the swipe gesture in millimeters per second.
        startPosition: [], // The starting position within the Leap frame of reference, in mm
        state: "stop", // could be "start"? "update"? "stop"?
        type: "swipe" // "swipe"
    }

 */

define(["../apis/image"], function (ImageAPI) {

	var onProcessing = false;

	var directionObserver = {
		toRight: [],
		toLeft: [],
		toUp: [],
		toDown: []
	};

	var finishedMark = {
		start: false,
		end: false
	};


	function setFinishedMark (state, value) {
		// "update" 可能会丢失，并且出现也不规律
		// 暂且以"start"和"stop"为标志
		if (state == "update") {
			return;
		}
		finishedMark[state] = value? value: true;
	}

	function resetFinishedMark () {
		setFinishedMark("start", false);
		setFinishedMark("end", false);
	}

	function checkIsFinished () {
		for (var mark in finishedMark) {
			if (!finishedMark[mark]) {
				return false;
			}
		}
		return true;
	}

	function checkIsStart () {
		if (finishedMark["start"]) {
			return true;
		}
		return false;
	}

	function _callback (gestureInfo) {

		// 我要判断是向左滑动还是向右滑动
		// 是向上滑动还是向下滑动
		
		// 然后调用对应的API，这里采用观察者模式
		// 因为一个手势可能对应多个API
		
		// 最后再重置标志位，
		// 但这里有一个问题是，
		// 动画是有时间过程的(最好是在动画结束的回调里重置标志位)
		// 还好大部分都没有这个需求
		
		onProcessing = false;
		resetFinishedMark();
		
	}

	function entry (gestureInfo) {
		if (onProcessing) {
			return;
		}

		var data = gestureInfo.data;
		setFinishedMark(data.state);
		if (checkIsFinished()) {

			onProcessing = true;
			_callback(gestureInfo);
		}
	}

	return entry;
});