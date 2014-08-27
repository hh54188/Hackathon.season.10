define([
	"gestures/BaseGesture",
	"validate_flow/NativeFlow"], function (BaseGesture, NativeFlow) {
   	
   	function SwipeGesture () {
   		this.validateFlow = new this.ValidateFlowConstructor(this);
   	}

   	SwipeGesture.prototype =  Object.create(BaseGesture.prototype, {

   		ValidateFlowConstructor: {
			value: NativeFlow
		},

		validate: {
			value: function (frame) {

			}
		}
   	});

   	return SwipeGesture;
});