# Gesture Recognition Engine

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



