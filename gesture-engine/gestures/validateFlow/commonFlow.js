define (["validateFlow/BaseFlow",
		"validateProcedure/CommonStartProcedure", 
		"validateProcedure/CommonMoveProcedure",
		"validateProcedure/CommonEndProcedure"], 
		function (BaseFlow, StartProcedure, MoveProcedure, EndProcedure) {

	function CommonFlow (gesture) {

		var endProcedure = new EndProcedure(gesture);
		var moveProcedure = new MoveProcedure(gesture, endProcedure);
		var startProcedure = new StartProcedure(gesture, moveProcedure);


		this.validate = function (frame) {
			return startProcedure.validate(frame);
		}
	}

	CommonFlow.prototype = Object.create(BaseFlow.prototype);

	return CommonFlow;
});