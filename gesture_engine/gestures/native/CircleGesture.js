define([
	"gestures/BaseGesture",
	"validate_flow/NativeFlow"], function (BaseGesture, NativeFlow) {
   	
   	function CircleGesture () {
   		this.validateFlow = new this.ValidateFlowConstructor(this);
   	}

   	CircleGesture.prototype =  Object.create(BaseGesture.prototype, {

   		ValidateFlowConstructor: {
			value: NativeFlow
		},

		validate: {
			value: function (frame) {

			}
		}
   	});

   	return CircleGesture;
});