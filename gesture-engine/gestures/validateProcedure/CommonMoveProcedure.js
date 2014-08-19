define(["base"], function (BaseProcedure) {

    function CommonMoveProcedure (gesture, nextProcedure) {

        this.gesture = gesture;
        this.successor = nextProcedure || null;
    }

    CommonMoveProcedure.prototype = Object.create(BaseProcedure, {

        validate: {
            value: function (frame) {

                var gesture = this.gesture;
                if (gesture.validateGestureOnMove(frame) 
                        && gesture.validateGestureBasicCondition(frame)) {
                    return true;    
                }

                return false;
            }
        }
    });

    return CommonMoveProcedure;
});