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


define([
    "gestures/native/CircleGesture", 
    "gestures/native/SwipeGesture",
    "gestures/native/KeyTapsGesture",
    "gestures/native/ScreenTapsGesture"], function () {

    var gestures = (function GestureValidate(gestures) {

        var result = {};
        var matchName = /(\w+)Gesture/;

        toArray(gestures).forEach(function (Gesture) {

            var gestureName = Gesture.name.match(matchName)[1];
            result[gestureName] = new Gesture;
        });
        debugger
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

            for (var name in gestures) {
                eventList[name] = [];
            };

            this._gestureCount = eventList.length;
        },

        _checkGesture: function (frame) {
            var gestures = this._gestures,
                gesture;
            var _this = this;

            for (var name in gestures) {
                gesture = gestures[name];
                if (gesture.validate(frame)) {
                    _this._dispatch(name, frame);
                }                
            }
        },

        _dispatch: function (evt) {
            var eventList = this._registeredEventList;
            if (!eventList[evt]) return;

            eventList[evt].forEach(function (callback) {
                callback(toArray(arguments).slice(1));
            });
        },

        on: function (evt, callback) {
            var eventList = this._registeredEventList;
            if (!eventList[evt]) return;

            eventList[evt].push(callback.bind(this));
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