define([
	"gestures/BaseGesture",
	"validate_flow/NativeFlow"], function (BaseGesture, NativeFlow) {
   	
   	function KeyTapsGesture () {
   		this.validateFlow = new this.ValidateFlowConstructor(this);
   	}

   	KeyTapsGesture.prototype =  Object.create(BaseGesture.prototype, {

   		ValidateFlowConstructor: {
			value: NativeFlow
		},

		validate: {
			value: function (frame) {

			}
		}
   	});

   	return KeyTapsGesture;
});