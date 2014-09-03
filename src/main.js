require(["./gesture_engine/engine", "./apis/image", "./lib/leap"], function (Engine, ImgAPI, LeapMotionDoesnotWork) {

    // leap.js 不兼容AMD格式，加载依赖但无导出接口
    // 但是为了能够加载这个类库，需要引用leap
    // 所以直接只用leap.js定义的全局变量
    var controller = new Leap.Controller({
         enableGestures: true
    });

    var engine;

    controller.on("connect", function () {

        engine = new Engine;
        engine.on("swipe", function (gestureInfo) {
            console.log(gestureInfo);
        });
    });

    controller.on("gesture", function (gesture) {
        // 还是需要具体的手势参数的
        // 比如一个swipe手势，可能是从左到右，
        // 也可能是从右到走，需要具体的数据进行判断
        debugger
        console.log(gesture);
        engine.gestureHappened(gesture);
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
});
