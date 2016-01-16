/**
 * Created by brenden on 1/16/2016.
 */
//given a board and an x,y position for a cell, this class will evaluate a given function for each neighbor
//basically this is just so that other classes can inherit the prototype and use this (sort of) static method
var NeighborChecker = function(options){
    var self = this instanceof NeighborChecker ? this : Object.create(NeighborChecker.prototype);
    return self;
};
NeighborChecker.prototype.checkNeighbors = function(board,cellX,cellY,toEvaluate){
    //checking because yes i do screw this up
    if(board === undefined) throw "board is undefined";
    if(cellX === undefined) throw "x position is undefined";
    if(cellY === undefined) throw "y position is undefined";
    if(toEvaluate === undefined) throw "function to evaluate with is undefined";

    //evaluate "toEvaluate" on 3x3 grid (except for the x and y that was passed in)
    for(var y = cellY - 1; y <= cellY + 1; y ++){
        for(var x = cellX - 1; x <= cellX + 1; x++){
            //make sure board exists out to these coordinates
            if(board[x] !== undefined && board[x][y] !== undefined){
                //this is the current cell, don't evaluate here
                if(x === cellX && y === cellY) continue;
                toEvaluate(board[x][y])
            }
        }
    }
};