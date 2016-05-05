define(function () {
    var app = angular.module('checkers', []); 
    
    require([
        'checkersHelper',
        'checkersControls',
        'checkersBoard',
        'checkersLogger',
        'checkersInfo',
        'checkersSettings'], function () {
            angular.bootstrap(document, ['checkers']);
    });
});