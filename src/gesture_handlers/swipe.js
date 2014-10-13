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

    手要适当倾斜才能有效果，垂直状态机器无法识别

 */

define(["../apis/image", "../apis/notify"], function (ImageAPI, Notify) {

	var onProcessing = false;
	// 如果swipe触发太快，
	// 那么需要通过触发时间间隔来控制
	// 在测试之前先保留
	var lastActionTimestamp = 0;
	var actionInteral = 500 * 1;

	var directionObserver = {
		right: [ImageAPI.prevImage],  
		left: [ImageAPI.nextImage], 
		up: [],
		down: []
	};
	
	function _checkActionInterval () {
		return (+new Date) - lastActionTimestamp > actionInteral
				? true
				: false;
	}

	function _dispatchAPI (direction) {
		directionObserver[direction].forEach(function (fn) {
			if (fn) {
				fn();
			}
		});
	}

	function _computeDirection (gesture) {
		 
		 // 代码直接摘抄自 
		 // https://developer.leapmotion.com/documentation/skeletal/javascript/api/Leap.SwipeGesture.html#SwipeGesture
		 var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
		 var swipeDirection;

		if (isHorizontal) {

            if(gesture.direction[0] > 0){
                swipeDirection = "right";
           	} else {
                swipeDirection = "left";
            }

        } else {
        	
        	if(gesture.direction[1] > 0){
            	swipeDirection = "up";
          	} else {
              	swipeDirection = "down";
          	}                  
        }

        return swipeDirection;
	}

	function _callback (rawInfo) {

		// 我要判断是向左滑动还是向右滑动
		// 是向上滑动还是向下滑动
		var direction = _computeDirection(rawInfo);
		lastActionTimestamp = +new Date;
		_dispatchAPI(direction);
		console.log(direction);
		Notify.log("右手滑动方向是" + direction);
		
		// 然后调用对应的API，这里采用观察者模式
		// 因为一个手势可能对应多个API
		
		// 最后再重置标志位，
		// 但这里有一个问题是，
		// 动画是有时间过程的(最好是在动画结束的回调里重置标志位)
		// 还好大部分都没有这个需	求
		onProcessing = false;
	}

	function entry (controller, frame) {

		var curFrame = frame;

		// 如果还在响应当前手势，或者当前帧没有手势，则返回
		if (onProcessing || !curFrame.gestures || !curFrame.gestures.length) {
			return
		}

		var gesture = curFrame.gestures[0];
		if (gesture.type != "swipe") {
			return;
		}

		if (_checkActionInterval()) {
			onProcessing = true;
			_callback(gesture);
		}
	}

	return entry;
});