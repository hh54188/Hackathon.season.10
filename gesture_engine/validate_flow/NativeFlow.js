define(["validate_flow/BaseFlow"], function (BaseFlow) {

	function NativeFlow (gesture) {
		this.gesture = gesture;
	}

	NativeFlow.prototype = Object.create(BaseFlow.prototype, {

		validate: {
			value: function (frame) {
				return this.gesture.validate(frame);
			}
		}
	})

	return NativeFlow;
});