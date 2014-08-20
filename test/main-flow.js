requirejs.config({
    baseUrl: '../gesture-engine/gestures',
    paths: {
        BaseGesture: 'basic/BaseGesture'
    }
});


require(["BaseGesture"], function (BaseGesture) {

	var TestGesture = function () {};
	TestGesture.prototype = Object.create(BaseGesture, {});

	var testGesture = new TestGesture;

	
	/*
		如何测试
		需要验证三种情况：
		1. 手势通过
		2. 挂在初始验证
		3. 挂在移动验证
			4. 挂在基本手势
		5. 挂在结束验证

		需要5个数组，每个数组15个长度的帧

		注意：这个测试只能够用来验证validateflow。
		但是内部的procedure不能验证，因为只能返回flow只能返回true或false，
		不能分别究竟在哪一个procedure退出的
		（手势验证只能等待实战了）

	 */
	
	// commonFlow.valiate(testframe01);
	

});