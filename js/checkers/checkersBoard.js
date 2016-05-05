define(function () {
    'use strict';
    
    angular.module('checkers').directive('checkersBoard', ['checkersHelper', 'checkersLogger', function (checkersHelper, checkersLogger) {
        return {
            link: function ($scope, element, attr) {            
                var board = element.find('.board');
                var cemetery = element.find('.cemetery');
                            
                var pause = function () {
                    var selected = board.find('td.selected');
                    var possibles = board.find('td.possible');

                    selected.removeClass('selected');
                    possibles.removeClass('possible');

                    board.css('opacity', 0.7).click( function () {
                        resume();
                    }); 
                };
                
                var resume = function () {            
                    board.css('opacity', 1);
                    board.off('click');
                    $scope.$apply(function () { checkersHelper.resume(); });   
                };
                
                var getChecker = function (element) {
                    return element.children('div').first();
                };
                
                var stepBack = function () {
                    var step = checkersLogger.popStep();
                    
                    if (step) {
                        if (checkersHelper.onPause) 
                            resume();
                        
                        if (step.from) {
                            var from = new Cell(getCell(board, step.from.i, step.from.j));
                            var to = new Cell(getCell(board, step.to.i, step.to.j));
                            var toChecker = getChecker(to.el);
                            var fromChecker = getChecker(from.el);

                            if (step.uber) {
                                toChecker.attr('uber', false);
                            }

                            from.el.append(toChecker);
                            to.el.append(fromChecker);

                            step.deleted.forEach(function (item) {
                                var checker = cemetery.children('div').last();
                                getCell(board, item.i, item.j).append(checker);
                                checker.css('display','block');
                            });
                        }
                        
                        checkersHelper.transferControl();
                        checkersHelper.resetTime();
                        checkersHelper.pause();
                    }
                };
                
                checkersHelper.setStepBack(stepBack);
                checkersHelper.setPause(pause);
                
                var forAllCells = function (callback) {
                    var rows = board.find('tr');
                    
                    for (let i = 0; i < rows.length; i++) {
                        for (let j = 0, row = rows[i].children; j < row.length; j++) {
                            callback($(row[j]), i, j);
                        }
                    }
                };
                
                var initBoard = function (cell, i, j) {
                    cell.attr({
                        'data-i': i,
                        'data-j': j
                    });
                };

                var timeLeftCallback = function () {
                    checkersLogger.addMove();
                    checkersHelper.pause();
                };
                
                var placeCheckers = function (cell, i, j) {
                    if ((i==0 || i==2) && j%2 == 1 || i==1 && j%2 != 1) {
                        cell.append('<div></div>');
                        getChecker(cell).attr({'data-side': 'top'}).addClass('top');
                    }
                    if ((i==5 || i==7) && j%2 == 0 || i==6 && j%2 != 0) {
                        cell.append('<div></div>');
                        getChecker(cell).attr({'data-side': 'bot'}).addClass('bot');   
                    }
                };
                
                var setBotColor = function () {
                    var bot = element.find('.bot');  
                    bot.css('backgroundColor', checkersHelper.botColor);
                };
                
                var setTopColor = function () {
                    var top = element.find('.top');  
                    top.css('backgroundColor', checkersHelper.topColor);
                };
                
                $scope.$watch(function () { return checkersHelper.topColor; }, setTopColor);
                
                $scope.$watch(function () { return checkersHelper.botColor; }, setBotColor);
                
                var preparation = function () { 
                    board.css('opacity', 0.5);
                    forAllCells(placeCheckers);
                    checkersHelper.resetTurn();
                    
                    setBotColor();
                    setTopColor();
                    
                    board.click( function () {
                        board.css('opacity', 1);
                        board.off('click');
                        board.find('td').click(movement);
                        $scope.$apply(function () { checkersHelper.start(timeLeftCallback); });   
                    }); 
                };

                var getCell = function (self, i, j) {
                    return self.find('tr:eq(' + i + ') td:eq(' + j + ')');
                };

                var hasDiv = function (element) {
                    return !!element.children('div').length;
                };

                var isEnemy = function (self, possible) {
                    return getChecker(self).attr('data-side') != getChecker(possible).attr('data-side');
                };

                var checkWin = function () {
                    var top = board.find('.top');  
                    var bot = board.find('.bot');

                    if(bot.length == 0) 
                        onWin(top, 'top');
                    if(top.length == 0)
                        onWin(bot, 'bot');   
                };

                var onWin = function (checkers, name) {
                    checkers.remove();
                    cemetery.empty();
                    checkersHelper.stop();
                    checkersLogger.reset();
                    preparation();
                    alert(name + ' player is winner!');
                };

                var setPossibles = function (self, lookForward) {
                    var i = +self.attr('data-i');
                    var j = +self.attr('data-j');
                    var offset;

                    if (getChecker(self).attr('data-side') == 'top')            
                        offset = lookForward;
                    else
                        offset = -lookForward;

                    i += offset;

                    if (i != 8 && i != -1) {
                        if (j != 7)
                            setPossible(self, i, j, offset, 1, lookForward);
                        if (j != 0)
                            setPossible(self, i, j, offset, -1, lookForward);
                    }                    
                };
                
                var setPossible = function (self, i, j, offsetI, offsetJ, lookForward) {
                    j += offsetJ;
                    var possible = getCell(board, i, j);

                    if (hasDiv(possible) && isEnemy(self, possible) && i + offsetI != 8 && i + offsetI != -1 && j + offsetJ != 8 && j + offsetJ != -1) {
                        i += offsetI;
                        j += offsetJ;
                        possible = getCell(board, i, j);
                        if (!hasDiv(possible))
                            possible.addClass('possible');
                        i -= offsetI;
                        j -= offsetJ;
                    }
                    else
                        if (!hasDiv(possible) && lookForward != -1)
                            possible.addClass('possible');
                };
                
                var setPossiblesUber = function (self) {
                    var i = +self.attr('data-i');
                    var j = +self.attr('data-j');
                    
                    setPossibleUber(self, i, j, 1, 1);
                    setPossibleUber(self, i, j, -1, 1);
                    setPossibleUber(self, i, j, 1, -1);
                    setPossibleUber(self, i, j, -1, -1);
                };

                var setPossibleUber = function (self, i, j, offsetI, offsetJ) {
                    var currCell;
                    var wasEnemy = false;
                    
                    while (i + offsetI != 8 && i + offsetI != -1 && j + offsetJ != 8 && j + offsetJ != -1) {
                        i += offsetI;
                        j += offsetJ;
                        currCell = getCell(board, i, j);
                        if (hasDiv(currCell)) {
                            if (wasEnemy) 
                                break;
                            wasEnemy = true;
                            if(!isEnemy(self, currCell))
                                break;
                        }
                        else {
                            currCell.addClass('possible');
                            wasEnemy = false;
                        }
                    }
                };
                
                var repairAfterUberStroke = function (from, to) {
                    var currCell;
                    var deleted = [];
                    var i = from.i;
                    var j = from.j;
                    
                    if (from.i < to.i) 
                        var offsetI = 1;
                    else
                        offsetI = -1;
                    if (from.j < to.j) 
                        var offsetJ = 1;
                    else
                        offsetJ = -1;
                    
                    while (i + offsetI != to.i) {
                        i = i + offsetI;
                        j = j + offsetJ;
                        
                        currCell = getCell(board, i, j);
                        if (hasDiv(currCell)) {
                            deleted.push(currCell);
                        }
                    }  
                    
                    return deleted;
                };
                
                var clearCell = function (cell) {
                    cemetery.append(getChecker(cell).css('display','none'));
                };

                var Cell = function (self) {  
                    return {
                        el: self,
                        i: +self.attr('data-i'),
                        j: +self.attr('data-j') 
                    };
                }

                var selectChecker = function (self, selected, possibles) {
                    possibles.removeClass('possible');
                    selected.el.removeClass('selected');
                    self.el.addClass('selected');
                    
                    if (getChecker(self.el).attr('uber') == 'true') {
                        setPossiblesUber(self.el);
                    }
                    else { 
                        setPossibles(self.el, 1);
                        setPossibles(self.el, -1);
                    }
                };
                
                var makeMove = function (self, selected, possibles) {
                    var deleted = [];
                    var selectedChecker = getChecker(selected.el);
                    var uber = false;
                    
                    if (selectedChecker.attr('uber') == 'true')
                        deleted = repairAfterUberStroke(selected, self);
                    else {
                        let cell = getCell(board, (self.i + selected.i)/2, (self.j + selected.j)/2);
                        if (hasDiv(cell))
                            deleted[0] = cell;    
                    }            
                    
                    self.el.append(selectedChecker);
                    selected.el.removeClass('selected');
                    possibles.removeClass('possible');
                    
                    var checker = getChecker(self.el);
                    
                    if (self.el.attr('data-i') == 0 && checker.attr('data-side') == 'bot' ||
                        self.el.attr('data-i') == 7 && checker.attr('data-side') == 'top') {
                        checker.attr('uber',true); 
                        uber = true;
                    }
                    
                    checkersLogger.addMove(selected, self, deleted, uber);    
                    deleted.forEach(clearCell);
                    
                    checkersHelper.transferControl();

                    checkWin();
                    $scope.$apply(function () { checkersHelper.start(timeLeftCallback); });    
                };
                
                var movement = function () {     
                    var self = new Cell($(this));
                    var selected = new Cell(board.find('td.selected'));
                    var possibles = board.find('td.possible');
                    if (hasDiv(self.el) && getChecker(self.el).attr('data-side') == checkersHelper.getTurn()) { 
                        selectChecker(self, selected, possibles);
                    }
                    else {
                        if (self.el.hasClass('possible')) { 
                            makeMove(self, selected, possibles);
                        }
                        else {
                            possibles.removeClass('possible');
                            selected.el.removeClass('selected');    
                        }
                    }
                };
                                
                forAllCells(initBoard);
                preparation();
            },
            scope: true,
            template: 
            '<div class=checkers>'+
                '<table class=board >'+
                    '<tr>' +
                        '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                '</table>'+
                '<div class=cemetery></div>'+
            '</div>',
            restrict: 'E'
        };
    }]);
});

