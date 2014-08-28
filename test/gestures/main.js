requirejs.config({
    baseUrl: '../../gesture_engine/'
});


require(["engine"], function (Engine) {

    var controller = new Leap.Controller({
         enableGestures: true
    });
    
    var engine;

    controller.on("connect", function () {
        engine = new Engine;
        debugger
        engine.on("circle", function (gestureType, frame) {
            // console.log(gestureType, frame);
        });
    });

    controller.on("gesture", function (gesture, frame) {
        engine.gestureHappened(gesture.type, frame);
    });

    controller.on("frame", function (frame) {
        engine.frameHappened(frame);
    });



    controller.on("disconnect", function () {
        console.error("disconnect");
    });

    controller.on("deviceDisconnected", function () {
        console.error("deviceDisconnected");
    });



    controller.connect();
})