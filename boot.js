define(["../gesture-engine/engine"], function (Engine) {

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
});