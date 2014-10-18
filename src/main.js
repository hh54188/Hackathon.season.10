requirejs.config({
    baseUrl: "./src/"
});


window.onload = function () {
    require(
        [
            "./gesture_engine/engine", 
            "./gesture_handlers/swipe",
            "./gesture_handlers/circle",
            "./gesture_handlers/translate",
            "./gesture_handlers/risedock",
            "./gesture_handlers/rotate"
        ], function (
            Engine, 
            swipeHandler,
            circleHandler,
            translateHandler,
            risedockHandler,
            rotateHandler
        ) {

        // leap.js 不兼容AMD格式，加载依赖但无导出接口
        // 但是为了能够加载这个类库，需要引用leap
        // 所以直接只用leap.js定义的全局变量
        if (!window.Leap) return; 
        
        var controller = new Leap.Controller({
             enableGestures: true
        });

        var engine;
        
        controller.on("connect", function () {

            engine = new Engine(controller);
            engine.on("swipe", swipeHandler);
            engine.on("circle", circleHandler);
            engine.on("translate", translateHandler);
            engine.on("risedock", risedockHandler);
            engine.on("rotate", rotateHandler);
            /*
                 1. 把当前帧交给Gesture验证，如果.validate方法返回为true
                 2. 则再由handler再对图片做处理（handler里面会记录图片的当前位置）

             */
            // engine.on("translate", swipeHandler); // 图片横向移动
            // engine.on("scale", swipeHandler); // 图片缩放
            // engine.on("rotate", swipeHandler); // 图片旋转
        });

        controller.on("gesture", function (gesture, frame) {
            engine.gestureHappened(gesture, frame);
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
}

