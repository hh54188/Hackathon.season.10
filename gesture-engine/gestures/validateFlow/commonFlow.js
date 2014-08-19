define (["base", 
		"../validateProcedure/CommonStartProcedure", 
		"../valdiateProcedure/CommonMoveProcedure",
		"../valdiateProcedure/CommonEndProcedure"], 
		function (BaseFlow, StartProcedure, MoveProcedure, EndProcedure) {

	function CommonFlow (gesture) {

		var endProcedure = new EndProcedure(gesture);
		var moveProcedure = new MoveProcedure(gesture, endProcedure);
		var startProcedure = new StartProcedure(gesture, moveProcedure);

		// Define custom validate API method
		this.validte = function (frame) {

			return startProcedure.validate(frame);
		}
	}

	CommonFlow.prototype = Object.create(BaseFlow.prototype);

	return CommonFlow;
});