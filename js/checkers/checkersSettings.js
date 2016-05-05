define(function () {
    'use strict';
    
    angular.module('checkers').directive('checkersSettings', ['checkersHelper', function (checkersHelper) {
        return {
            link: function ($scope, element) {
                $scope.time = 20;
                
                $scope.topColor = 'snow';
                
                $scope.botColor = 'brown';
                
                $scope.$watch(function () { return $scope.time }, function () {
                    checkersHelper.setTimeLimit($scope.time);
                });
                
                $scope.$watch(function () { return $scope.botColor }, function () {
                    checkersHelper.botColor = $scope.botColor;
                });
                
                $scope.$watch(function () { return $scope.topColor }, function () {
                    checkersHelper.topColor = $scope.topColor;
                });
            },
            scope: true,
            template: 
            '<div class=settings>'+
                '<input type="text" ng-model="time"></input>'+
                '<input type="text" ng-model="topColor"></input>'+
                '<input type="text" ng-model="botColor"></input>'+
            '</div>',
            restrict: 'E'
        };
    }]);
});