define(function () {

	var emptyFn = function () { return true; }

	function BaseFlow () {

	}

	BaseFlow.prototype = {
		validate: emptyFn,
		reset: emptyFn
	}
	
	return BaseFlow;
});