var GestureBase = (function () {
    var gesture = {}

    var IsRecognitionStarted;
    var CurrentFrameCount;
    var MaximumNumberOfFrameToProcess = 15;
    var GestureTimeStamp;

    var ValidateGestureStartCondition = new Function;
    var ValidateGestureEndCondition = new Function;
    /*
        Will check if the right hand position is between the shoulder and the spine joint. 
    */
    var ValidateBaseCondition = new Function;
    /*
        Will verify if the hand is moving from the right-toleft direction 
        and the distance between the right hand joint and the left shoulder is decreasing.
    */
    var IsGestureValid = new Function;

    var CheckForGesture = function (frame) {

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

    return gesture;
})();