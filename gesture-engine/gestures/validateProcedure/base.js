// ##　关于validate规则的设定，如果保证在职责链模式下实现环节传递
//
// 对于第一步的successor执行返回有两种true值：
// 
// 在反复验证第二步时，通过，返回true，此时第一步（也就是当前这一步）的pass标记不能被重置
// 
// 在第三步验证通过后，整个*动作*验证通过，此时第一步（也就是当前这一步）的pass标记需要被重置，
// 以便验证下一轮手势
// 
// 如何区分这两种true值？
// 
// 解决方案：
// 1. 计数需要验证的frame数，第二轮环节每通过一帧则帧数--
// 于是第一步的validate方法比较特殊，需要子类覆盖父类
// 
//
//  
// 返回如何判断是执行自己还是执行下一环节？
// 
// 还是要通过maxFrame
// 
// 
// 最后一步，如果pass那么就真的pass了
define (function () {

	function emptyFn () {
		return true;
	}
	
	function BaseProcedure (gesture, nextProcedure) {

		// 虽然这一部分没有可能被继承
		// 但仍然展示在这里以供参考
		
		// 初始化默认最大帧数，用于倒计数
		this.frameCount = this.maxFrameNum;

		// 职责链模式的下一个继承者
		this.successor = nextProcedure || null;

		// 所需要验证的手势
		this.gesture = gesture;
	}

	BaseProcedure.prototype = {

		// 通过验证的最大帧数，非常重要
		maxFrameNum: 15,

		// 对外检测接口
		validate: emptyFn,

		// 自己执行
		validateSelf: function (frame) {

			if (this.validate(frame)) {
				return true;
			}

			return false;
		},

		// 传递给下一个继承者
		validateNext: function (frame) {

			var successor = this.successor;

			if (!successor) {
				return false;
			}

			if (successor.validate(frame)) {
				return true;
			}

			return false;
		}
	}

	return BaseProcedure;
})