# Gesture Recognition Engine

## 引擎设计详解

如果按照最原始的Kincet书中的引擎设计`/gestures/basic/base_backup.js`
将以不同的手势为单位，每一个手势中都有独立但都相似的运作流程，这么设计具有以下几个问题：

- 运作流程
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

首先尝试修改原来的代码，把流程*注入依赖*


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



