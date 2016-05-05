define(function () {
    'use strict';
    
    angular.module('checkers').factory('checkersLogger', function () {
        var self = this;
        
        var steps = [];
        
        var Step = function (from, to, deleted, uber) {
          if (from == undefined) 
              return {};
            
          return {
              from: {
                  i: from.i,
                  j: from.j
              },
              to: {
                  i: to.i,
                  j: to.j
              },
              deleted: (function () {                  
                  var indexes = [];
                  deleted.forEach(function (item) {
                      indexes.push({
                          i: +item.attr('data-i'), 
                          j:+item.attr('data-j') 
                      });                             
                  });
                  return indexes;
              })(),
              uber: uber
          };
        };
                
        self.popStep = function () {
            return steps.pop();
        };
        
        self.addMove = function (from, to, deleted, uber) {
            steps.push(new Step(from, to, deleted, uber));
        };
        
        self.getSteps = function () {
            return steps;     
        };
        
        self.getCount = function () {
            return steps.length;  
        };
        
        self.reset = function () {
            steps = [];        
        };

        return self;
    });
});