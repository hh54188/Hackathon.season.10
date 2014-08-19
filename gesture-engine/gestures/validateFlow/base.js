define(function () {

	var emptyFn = function () { return true; }

	function BaseFlow () {

	}

	BaseFlow.prototype = {
		validate: emptyFn
	}
	
	return BaseFlow;
});