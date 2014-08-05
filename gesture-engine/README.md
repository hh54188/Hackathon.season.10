# Gesture Recognition Engine

## 引擎设计详解 / 写给前端人看的如何变面向过程为面向对象

如果按照最原始的Kincet书中的引擎设计`/gestures/basic/base_backup.js`
将以不同的手势为单位，每一个手势中都有独立但都相似的运作流程，这么设计具有以下几个问题：

- 验证流程
	- 代码不可以复用
	- 修改起来会非常麻烦，会透露了细节，违背了**开放-封闭**原则
	- 代码不够灵活，如果以后想增加一环节怎么办

- 手势代码
	- 无法复用，手势`右手手掌朝上`与`右手手掌朝上移动`虽然是不同的手势，但明显有重复。
	但是在旧的机制下，无法实现复用

在设计中，同时为了解决上面的问题，一共要用到三种设计模式：

- 职责链模式
- 组合模式
- 策略模式

首先尝试修改原来的代码，首先把验证流程


```
var GestureBase = {
	isRecognized: false,

	validateStartCondition: function () {},

	validateEndCondition: function () {},

	checkGesture: function (frame) {

        if (this.isRecognized == false) {

            if (this.validateStartCondition(frame)) {
                this.isRecognized = true;
                this.CurrentFrameCount = 0;
            }
        }
        // TODO
	}
}

var SwipeGesture = Object.create(GestureBase, {

	validateStartCondition: function () {} // override

	validateEndCondition: function () {} // override

	checkGesture: function () {} // override
	/*
		checkGesture: commonWorkflow	
	*/
})

var ValidateProcedure = {
	successor: null,
	validate: function () { return true; },
	next: function (frame) {
		if (this.successor) {
			return this.successor.validate(frame)
		}
		return false
	},
	continue: function (frame) {
		reutrn this.validate(frame);
	}
}
// `Object.create` 在这里实际上是通过父类直接创建了一个实例，而不是创建子类
var validateStartCondition = Object.create(ValidateProcedure, {
	validate: {
		value: function (frame, gesture) {
			// Implement detail
			// TODO
		}
	}
});

var validateEndCondition;
var validateMoveCondition;

var commonValidateWorkflow = function (frame,gesture) {

	validateStartCondition.succressor = validateMoveCondition;
	valdiateMoveCondition.successor = validateEndCondition;

	validateStartCondition.validate(frame, gesture);
}


var specialValidateWorkflow = function (frame, gesture) {
	
}
```

```
var GRE = new GestureRecognitionEngine();

/*
    Listen on Event:
*/

// Gesture event
GRE.on("gesture:swift2left", function () {
// GRE.on("swift2left", ) may be OK, but will be less performance

}).on("gesture:swift2right", function () {

// General event
}).on("gestureRecognised", function () {

})

/*
    Custom Event
*/

GRE.defineEvent("rightHandIn", function (frame) {
    reutrn 
});

/*
    Trigger Event

    Note:Fource to trigger event may cause problem
*/

GRE.fire("gesture:swift2right", argu1, arg2);

```



