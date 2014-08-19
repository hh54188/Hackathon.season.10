define(["base"], function (BaseProcedure) {

    function CommonEndProcedure (gesture, nextProcedure) {

        this.gesture = gesture;
        this.successor = nextProcedure || null;
    }

    CommonEndProcedure.prototype = Object.create(BaseProcedure, {

        validate: {
            value: function (frame) {

                var gesture = this.gesture;
                if (gesture.validateGestureEnd(frame) 
                        && gesture.validateGestureBasicCondition(frame)) {
                    return true;    
                }

                return false;
            }
        }
    });

    return CommonEndProcedure;
});