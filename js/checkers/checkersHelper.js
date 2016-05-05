define(function () {
    'use strict';
    
    angular.module('checkers').factory('checkersHelper', function ($interval) {
        var self = this;
        
        var timer;
        var timeLeftCallback;
        var stepBackCallback;
        var pauseCallback;
        var turn;
        self.onPause = true;
        var timeLimit = 7;
        var left = timeLimit;
        
        self.topColor;
        
        self.botColor;
        
        self.resetTurn = function () {
            turn = 'top';
        };
        
        self.setTimeLimit = function (time) {
            if (time && !isNaN(+time)) {
                timeLimit = +time; 
                left = timeLimit;
            }
        };
        
        self.setStepBack = function (callback) {
            stepBackCallback = callback;
        };
        
        self.stepBack = function () {
            if (stepBackCallback)
                stepBackCallback();
        };
        
        self.setPause = function (callback) {
            pauseCallback = callback;
        };    
        
        self.getTimeLeft = function () {
            return left;       
        };
        
        self.getTurn = function () {
            return turn;
        };
        
        var step = function (callback) {
            left = left - 1;
            
            if (left < 0) {
                self.transferControl();
                self.start();
                timeLeftCallback();
            }
        };
        
        self.resetTime = function () {
            left = timeLimit;
        };
        
        self.start = function (onFinish) {            
            if (onFinish)
                timeLeftCallback = onFinish;
            
            self.onPause = false;
            self.stop();
            timer = $interval(function () { step(timeLeftCallback); }, 1000);
        };  

        self.stop = function () {
            left = timeLimit;
            $interval.cancel(timer);
        };
        
        self.pause = function () {
            if (!self.onPause && pauseCallback) {
                self.onPause = true;
                $interval.cancel(timer);
                pauseCallback();
            }
        };
        
        self.resume = function () {
            if (self.onPause) {
                self.onPause = false;
                timer = $interval(function () { step(timeLeftCallback); }, 1000);
            }
        };

        self.transferControl = function () {
            if (turn == 'top')
                turn = 'bot';
            else
                turn = 'top';
        };
        
        return self;
    });
});