define(["../gesture-engine/engine"], function (Engine) {

    var controller = new Leap.Controller({
         enableGestures: true
    });
    var engine;

    controller.on("connect", function () {
        engine = new Engine;

        engine.on("circle", function (frame) {
            console.log("CIRCLE", frame);
        });

        engine.on("swipe", function (frame) {
            console.log("SWIPE", frame);
        });
    });

    controller.on("frame", function (frame) {
        engine.frameHappened(frame);
    });

    controller.connect();
});