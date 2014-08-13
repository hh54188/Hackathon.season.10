define (function () {

	function emptyFn () {
		return true;
	}
	
	function BaseProcedure (nextProcedure) {

		// 职责链模式的下一个继承者
		this.successor = nextProcedure || null;
	}

	BaseProcedure.prototype = {

		// 对外检测接口
		validate: emptyFn,

		// 自己执行
		self: emptyFn,

		// 传递给下一个继承者
		next: emptyFn
	}

	return BaseProcedure;
})