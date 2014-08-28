requirejs.config({
    baseUrl: './gesture_engine/'
});


require(["engine",
        "../apis/image"], function (Engine, ImgAPI) {

    var controller = new Leap.Controller({
         enableGestures: true
    });
    
    var engine;

    controller.on("connect", function () {

        engine = new Engine;
        engine.on("swipe", function (gestureType, frame) {
            console.log(gestureType, frame);
        });
    });

    controller.on("gesture", function (gesture, frame) {
        // 还是需要具体的手势参数的
        // 比如一个swipe手势，可能是从左到右，
        // 也可能是从右到走，需要具体的数据进行判断
        debugger
        console.log(gesture, frame);
        // engine.gestureHappened(gesture.type, frame);
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