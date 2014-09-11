define([
	"./BaseGesture", 
	"../validate_flow/CommonFlow"], function (BaseGesture, CommonFlow) {

	function TranslateGesture () {

	}

	TestGesture.prototype = Object.create(BaseGesture.prototype, {

		ValidateFlowConstructor: {
			value: CommonFlow
		},

		validateGestureStart: {
			value: function () {

			}
		},

		validateGestureEnd: {

		},

		validateGestureOnMove: {

		},

		validateGestureBasicCondition: {

		}
	});
});