requirejs.config({
    baseUrl: '../gesture_engine/'
});


require(["engine"], function (Engine) {
	debugger
    var controller = new Leap.Controller({
         enableGestures: true
    });
    
    var engine;

    controller.on("connect", function () {
        engine = new Engine;
    });

    controller.on("frame", function (frame) {
        engine.frameHappened(frame);
    });

    controller.connect();
})