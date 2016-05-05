define(function () {
    'use strict';
    
    angular.module('checkers').controller('checkersInfo', ['$scope', 'checkersHelper', function ($scope, checkersHelper) {
        $scope.getInfo = function () {
            return 'Turn - ' + checkersHelper.getTurn() + '; Time left - ' + checkersHelper.getTimeLeft() + 's;';
        };

        $scope.getTurn = function () {
            return 'turn: ' + checkersHelper.getTurn() + ' player';
        };

        $scope.timeLeft = function () {
            return 'Time left - ' + checkersHelper.getTimeLeft() + 's';
        };
    }]);
});

