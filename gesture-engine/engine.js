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
    // Native Gesture:
    "./gestures/native/circle", 
    "./gestures/native/swipe",
    "./gestures/native/keyTaps",
    "./gestures/native/screenTaps"], function () {

    var gestures = (function GestureValidate(gestures) {

        var result = [];
        toArray(gestures).forEach(function (gesture) {
            // Duck type check
            if (isFunction(gesture.checkGesture) && isString(gesture.eventName)) {
                result.push(gesture);
            }
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

            gestures.forEach(function (gesture) {
                eventList[gesture.eventName] = [];
            });

            this._gestureCount = eventList.length;
        },

        _checkGesture: function (frame) {
            var gestures = this._gestures;
            var _this = this;
            gestures.forEach(function (gesture) {
                if (gesture.checkGesture(frame)) {
                    _this._dispatch(gesture.eventName, frame);
                }
            });
        },

        _dispatch: function (evt) {
            var eventList = this._registeredEventList;
            if (eventList.indexOf(evt) == -1) return;

            eventList[evt].forEach(function (callback) {
                callback(toArray(arguments).slice(1));
            });
        },

        on: function (evt, callback) {
            var eventList = this._registeredEventList;
            if (eventList.indexOf(evt) == -1) return;

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