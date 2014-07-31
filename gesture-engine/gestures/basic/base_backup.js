define(function () {

    var emptyFn = function () {
        return true;
    };

    var GestureBase = Object.defineProperties({}, {

        IsRecognitionStarted: {
            value: false
        },

        CurrentFrameCount: {
            value: 0
        },

        // If processed frame number is 0,
        // then disbale GestureProess validate
        MaximumNumberOfFrameToProcess: {
            value: 15
        },

        GestureTimeStamp: {
            value: +new Date
        },

        // Gesture Validate Function
        ValidateGestureStartCondition: {
            value: emptyFn
        },

        ValidateGestureEndCondition: {
            value: emptyFn
        },

        ValidateBaseCondition: {
            value: emptyFn
        },

        IsGestureValid: {
            value: emptyFn
        },
        
        // output gesture API
        CheckForGesture: {

            value: function (frame) {

                // Gesture Start:
                if (IsRecognitionStarted == false) {

                    if (ValidateGestureStartCondition(frame)) {
                        IsRecognitionStarted = true;
                        CurrentFrameCount = 0;
                    }

                } else {

                    // Gesture End:
                    if (CurrentFrameCount == MaximumNumberOfFrameToProcess) {
                        IsRecognitionStarted = false;
                        if (ValidateBaseCondition(frame) && ValidateGestureEndCondition(frame)) {
                            return true;
                        }
                    }

                    // Gesture Process
                    CurrentFrameCount++;
                    if (!IsGestureValid(frame) && !ValidateBaseCondition(frame)) {
                        IsRecognitionStarted = false;
                    }         
                }

                return false;
            }
        }

    });

    return GestureBase;  
})

