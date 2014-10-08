/*
    TODO: 一个手势同时触发了多个动作怎么办？
    
 */


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


define(["./gestures/TranslateGesture"], function (TranslateGesture) {

    var nativeGestureTypes = ["circle", "keyTap", "screenTap", "swipe"];

    var gestures = (function GestureValidate(gestures) {

        var result = {};
        var matchName = /(\w+)Gesture/;

        // Handle custom gestures:
        toArray(gestures).forEach(function (Gesture) {

            // var gestureName = Gesture.name.match(matchName)[1].toLowerCase();
            var originName = Gesture.name.match(matchName);
            var gestureName = originName[1].toLowerCase();
            
            result[gestureName] = new Gesture;
        });
        
        // Handle native gestures:
        nativeGestureTypes.forEach(function (gestureType) {
            result[gestureType] = new Function;
        });    

        return result;
        
    })(arguments);

    function GestureRecognitionEngine(controller) {
        this.controller = controller; 

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

            for (var gestureType in gestures) {

                if (nativeGestureTypes.indexOf(gestureType) > -1) {
                    return;
                } else {
                    gesture = gestures[gestureType];
                    var valdiateResult = gesture.validate(_this.controller, frame);

                    if (valdiateResult) {
                        _this._dispatch(gestureType, frame);
                    }                       
                }
            }
        },

        _dispatch: function (gestureType, frame) {

            var eventList = this._registeredEventList;
            var controller = this.controller;
            if (!eventList[gestureType] || !eventList[gestureType].length) return;

            eventList[gestureType].forEach(function (callback) {
                callback(controller, frame);
            });
        },

        on: function (evt, callback) {
            var eventList = this._registeredEventList;
            if (!eventList[evt]) return;

            eventList[evt].push(callback.bind(this));
        },

        gestureHappened: function (gestureInfo, frame) {
            this._dispatch(gestureInfo.type, frame);
        },

        frameHappened: function (frame) {
            this._checkGesture(frame);
        }
    }

    return GestureRecognitionEngine;
})