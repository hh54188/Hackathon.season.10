requirejs.config({
	baseUrl: "../../src"
});


/*
	# How to test(both in native gesture and custom gesture):
	
	## The interface below should be test:

	engine.on("swipe", fn); // 需要测试各种手势

	engine.fire(gestureInfo);
	
	- 比如使用原生真实的手势数据
	engine.gestureHappened(gesture);

	- 与framework测试用例大致相同
	engine.frameHappened(frame);


 */

define(["./gesture_engine"], function (GestureEngine) {
	engine = new Engine;

});