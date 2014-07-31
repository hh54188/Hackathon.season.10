define(function () {

    var emptyFn = function () {
        return true;
    };

    var IsRecognitionStarted = false,
        CurrentFrameCount = 0,
        MaxNumberOfFrameToProcess = 15,
        GestureTimeStamp = +new Date;


    var ProcedureClass = {
        successor: null,
        validate: emptyFn,
        next: function (frame) {
            var su = this.successor;
            if (su) {
                return su.validate(frame);
            }
            return false;
        },
        self: function (frame) {
            return this.validate(frame);
        }
    };

    // `Object.create(Base)` 可以理解为根据基类`Base`
    // 创建了*子类*的*实例*
    
    // 将手势的识别过程分为 Start-->Process-->End三个阶段
    // 实际上采用的是`职责链`模式
    // 暂不对外开放自定义的阶段，应该可以满足大部分需求
    var validateProcessEnd = Object.create(ProcedureClass, {
        validate: function (frame) {
            IsRecognitionStarted = false;
            // 如果结束手势验证成功
            if (validateGestureBasic(frame) && validateGestureEnd(frame)) {
                return true;
            }
            return false;
        }
    });

    var validateProcessing = Object.create(ProcedureClass, function () {
        successor: validateProcessEnd,
        validate: function (frame) {
            CurrentFrameCount++;
            // 如果手势验证失败
            if (!validateGestureMove(frame) && !validateGestureBasic(frame)) {
                IsRecognitionStarted = false;
                return false;
            // 如果允许验证最后一帧手势
            } else if (CurrentFrameCount == MaxNumberOfFrameToProcess){
                return this.next(frame);
            }
        }
    });

    var validateProcessStart = Object.create(ProcedureClass, function () {
        successor: validateProcessStart,
        validate: function (frame) {
            // 如果还未开始验证
            if (!IsRecognitionStarted) {
                // 如果触发手势验证成功
                if (validateGestureStart(frame)) {

                    IsRecognitionStarted = true;
                    CurrentFrameCount = 0;

                    return this.next(frame);
                } else {
                    return false;
                }
            } else {
                // 触发手势已经验证通过
                return this.next(frame);
            }

        }
    });


    var GestureBase = {
        checkForGesture: function (frame) {
            this.validateProcessStart(frame);
        },
        validateGestureStart: emptyFn,
        validateGestureMove: emptyFn,
        validateGestureEnd: emptyFn,
        validateGestureBasic: emptyFn,
    };

    var Gesture = function () {

    }

    /*
    
        Gesture({
            start: fn,
            move: fn,
            end: fn,
            basic: fn
        });

        Object.create(Gesture, {
            validateGestureStart: fn,
            validateGestureEnd: fn,
            validateGestureMove: fn
        });

        
     */

    return GestureBase;  
})

