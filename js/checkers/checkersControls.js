define(function () {
    'use strict';
    
    angular.module('checkers').directive('checkersControls', ['checkersHelper', 'checkersLogger', function (checkersHelper, checkersLogger) {
        return {
            link: function ($scope, element) {
                var history = element.find('.history');
                var currentStep = 0;
                var settings = $('.settings');
                var settingsBtn = element.find('.settingsBtn');
                var pauseBtn = element.find('.pauseBtn');
                var stepBackBtn = element.find('.stepBackBtn');
                
                var addRecord = function (step) {
                    var li = $(document.createElement('li'));
                    if (step.from) {
                        li.text('from-' + step.from.i + '-' +step.from.j + ' to-' + step.to.i + '-' + step.to.j);
                    }
                    else {
                        li.text('pass');   
                    }
                    history.append(li);
                };
                
                var removeRecord = function () {
                    history.children('li').last().remove();  
                };
                
                stepBackBtn.click(function () {
                    checkersHelper.stepBack(); 
                });
                
                pauseBtn.click(function () {
                    checkersHelper.pause(); 
                });
                
                settingsBtn.click(function () {
                    settings.slideToggle();
                });
                
                $scope.$watch(checkersLogger.getCount, function (len) {
                    if (len) {
                        stepBackBtn.removeAttr('disabled');
                    }
                    else {
                        stepBackBtn.attr('disabled','disabled');
                    }
                });
                
                $scope.$watch(function () { return checkersHelper.onPause; }, function (onPause) {
                    if (onPause) {
                        settingsBtn.removeAttr('disabled');
                        pauseBtn.attr('disabled','disabled');
                    }
                    else {
                        settingsBtn.attr('disabled','disabled');
                        pauseBtn.removeAttr('disabled');
                        settings.slideUp();
                    }
                });
                
                $scope.$watch(checkersLogger.getSteps, function (steps) {
                    var len = steps.length;
                    if (len == 0)
                        history.empty();
                    else {
                        if (len > currentStep)
                            addRecord(steps[len - 1]);
                        else
                            removeRecord();
                    }
                    currentStep = len;
                }, true);
            },
            scope: true,
            template: 
            '<div class=controls>'+
                '<ol class=history>'+
                '</ol>'+
                '<div class=buttonsGroup>'+
                    '<button class="btn stepBackBtn">Step back</button>'+
                    '<button class="btn pauseBtn">Pause</button>'+
                    '<button class="btn settingsBtn">Settings</button>'+
                '</div>'+
            '</div>',
            restrict: 'E'
        };
    }]);
});