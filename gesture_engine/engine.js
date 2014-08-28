var toArray = function (arguments) {
    return Array.prototype.slice.call(arguments);
};

var isFunction = function (fn) {
    return Object.prototype.toString.call(fn) == "[object Function]"? true: false;
};

var isArray = function (array) {
    return Object.prototype.toString.call(array) == "[object Array]"? true: false;
};

var isString = function (str) {
    return Object.prototype.toString.call(str) == "[object String]"? true: false;
};


define([], function () {

    var nativeGestureTyps = ["circle", "keyTap", "screenTap", "swipe"];

    var gestures = (function GestureValidate(gestures) {

        var result = {};
        var matchName = /(\w+)Gesture/;

        // Handle custom gestures:
        toArray(gestures).forEach(function (Gesture) {

            var gestureName = Gesture.name.match(matchName)[1];
            result[gestureName] = new Gesture;
        });
        
        // Handle native gestures:
        nativeGestureTyps.forEach(function (gestureType) {
            result[gestureType] = new Function;
        });    

        return result;
        
    })(arguments);

    function GestureRecognitionEngine() {

        this._registeredEventList = {};
        this._gestures = gestures;
        this._gestureCount;

        this._registerEvent();
    }

    GestureRecognitionEngine.prototype = {

        constructor: GestureRecognitionEngine,

        _registerEvent: function () {
            var gestures = this._gestures;
            var eventList = this._registeredEventList;

            for (var gestureType in gestures) {
                eventList[gestureType] = [];
            };

            this._gestureCount = eventList.length;
        },

        _checkGesture: function (frame) {
            var gestures = this._gestures,
                gesture;
            var _this = this;

            for (var type in gestures) {

                if (nativeGestureTyps.indexOf(type) > -1) {
                    return;
                } else {
                    gesture = gestures[type];
                    if (gesture.validate(frame)) {
                        _this._dispatch(type, frame);
                    }                       
                }
            }
        },

        _dispatch: function (gestureType, frame) {
            var eventList = this._registeredEventList;
            if (!eventList[gestureType].length) return;

            eventList[gestureType].forEach(function (callback) {
                callback(gestureType, frame);
            });
        },

        on: function (evt, callback) {
            var eventList = this._registeredEventList;
            if (!eventList[evt]) return;

            eventList[evt].push(callback.bind(this));
        },

        gestureHappened: function (gestureType, frame) {
            this._dispatch(gestureType, frame);
        },

        frameHappened: function (frame) {
            this._checkGesture(frame);
        },

        fire: function () {
            this._dispatch(arguments);
        }
    }

    return GestureRecognitionEngine;
})