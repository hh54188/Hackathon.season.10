var toArray = function () {
    return Array.prototype.slice.call(arguments);
};

var isFunction = function (fn) {
    return Object.prototype.toString.call(fn) == "[object Function]"? true: false;
};

var isArray = function (array) {
    return Object.prototype.toString.call(array) == "[object Array]"? true: false;
};

var isString = function (str) {
    return Object.prototype.toString.call(array) == "[object String]"? true: false;
};


define([
    "./gestures/native/circle", 
    "./gestures/native/swipe",
    "./gestures/native/keyTaps",
    "./gestures/native/screenTaps"], function () {

    var gestures = (function GestureValidate(gestures) {
        var result = [];
        (isArray(gestures)? gestures: [gestures]).forEach(function (gesture) {
            if (isFunction(gesture.checkGesture) && isString(gesture.eventName)) {
                result.push(gesture);
            }
        });

        return result;
    })(toArray(arguments));

    function GestureRecognitionEngine() {

        this._registeredEventList = {};
        this._gestures = gestures;
        this._gestureCount;

        // var _this = this;
        // gestures.forEach(function (gesture) {
        //     _this._registeredEventList[gesture.eventName] = [];
        // });
        // this._gestureCount = this._gestures.length
    }

    GestureRecognitionEngine.prototype = {

        constructor: GestureRecognitionEngine,

        _init: function () {
            var eventList = this._registeredEventList;

        },

        _registerEvent: function (type, isGesture) {

        },

        _checkGesture: function () {
            var gestures = this._gestures;
        },

        on: function (event, callback) {
            var eventList = this._registeredEventList;
            if (eventList.indexOf(event) == -1) return;

            eventList[event].push(callback.bind(this));
        },

        fire: function (event) {
            var eventList = this._registeredEventList;
            if (eventList.indexOf(event) == -1) return;

            eventList[event].forEach(function (callback) {
                callback(toArray(arguments).slice(1));
            });
        }
    }

    return GestureRecognitionEngine;
})