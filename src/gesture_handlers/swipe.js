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

define(["../apis/image"], function (ImageAPI) {

	var onProcessing = false;
	// 如果swipe触发太快，
	// 那么需要通过触发时间间隔来控制
	// 在测试之前先保留
	var lastActionTimestamp = 0;
	var actionInteral = 300 * 1;

	var directionObserver = {
		right: [ImageAPI.nextImage],
		left: [ImageAPI.prevImage],
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
			fn();
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
		
		
		// 然后调用对应的API，这里采用观察者模式
		// 因为一个手势可能对应多个API
		
		// 最后再重置标志位，
		// 但这里有一个问题是，
		// 动画是有时间过程的(最好是在动画结束的回调里重置标志位)
		// 还好大部分都没有这个需	求
		onProcessing = false;
	}

	function entry (controller) {
		var curFrame = controller.frame();

		// 按道理来说不应该会出现取出当前帧之后却发现没有任何手势
		// 这个问题以后再解决
		if (onProcessing || !curFrame.gestures || !curFrame.gestures.length) {
			return
		}

		var gesture = curFrame.gestures[0];
		if (gesture.type != "swipe") {
			return;
		}

		if (gesture.state == "stop" && _checkActionInterval()) {		
			onProcessing = true;
			_callback(gesture);
		}
	}

	return entry;
});