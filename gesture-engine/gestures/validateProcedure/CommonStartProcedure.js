define(["base"], function (BaseProcedure) {

	function CommonStartProcedure (nextProcedure) {

		this.successor = nextProcedure || null;
	}

	CommonStartProcedure.prototype = Object.create(BaseProcedure);

	return CommonStartProcedure;
})