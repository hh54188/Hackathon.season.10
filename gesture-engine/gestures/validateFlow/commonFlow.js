define (["base", 
		"../validateProcedure/CommonStartProcedure", 
		"../valdiateProcedure/CommonMoveProcedure",
		"../valdiateProcedure/CommonEndProcedure"], 
		function (BaseFlow, startProcedure, moveProcedure, endProcedure) {

	function CommonFlow (gesture) {

	}

	CommonFlow.prototype = Object.create(BaseFlow.prototype);

	return CommonFlow;
});