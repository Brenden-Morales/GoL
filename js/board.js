/**
 * Created by brenden on 1/16/2016.
 */
var GameBoard = function(options){
    var self = this instanceof GameBoard ? this : Object.create(GameBoard.prototype);

    //double check passed in options (yes I have screwed this up before, no this isn't a stupid thing to check)
    if(options === undefined) throw "must define width and height in passed in object";
    if(options.width === undefined) throw "must define width";
    if(options.height === undefined) throw "must define height";
    if(typeof options.width !== "number") throw "width must be a number";
    if(typeof options.height !== "number") throw "height must be a number";

    //rename width and height for ease of use
    var width = options.width;
    var height = options.height;

    //create the board array
    var makeBoard = function(){
        var board = new Array(width);
        for(var i = 0; i < width; i ++){
            board[i] = new Array(height);
            for(var j = 0; j < height; j++){
                board[i][j] = {};
            }
        }
        return board;
    };
    var currentBoard = makeBoard();

    self.clearBoard = function(){
        for(var x = 0; x < width;x++){
            for(var y = 0; y < height; y++){
                currentBoard[x][y] = {};
            }
        }
    };

    self.makeNewBoard = function(newWidth,newHeight){
        if(newWidth === undefined || typeof newWidth !== "number") throw "improper width";
        if(newHeight=== undefined || typeof newHeight!== "number") throw "improper height";
        self.clearBoard();
        width = newWidth;
        height = newHeight;
        currentBoard = makeBoard();
    };


    //the rules that we use on the game board
    var rules = [];
    self.addRule = function(rule){
        if(rule === undefined) throw "must give a rule";
        if(typeof rule !== "object") throw "rule must be an object";
        if(rule.run === undefined) throw "rule must have a run method";
        if(typeof rule.run !== "function") throw "rule.run must be a function";
        if(rule.getName === undefined) throw "rule.getName must be defined";
        if(typeof rule.getName !== "function") throw "rule.getName must be a function";

        //check to see if the rule has a dependency
        if(rule.hasDependency){
            if(rule.dependencyName === undefined || typeof rule.dependencyName !== "string") throw "dependency name not properly specified";
            var dependencyFound = false;
            for(var i = 0; i < rules.length; i++){
                if(rules[i].getName() === rule.dependencyName) dependencyFound = true;
            }
            if(!dependencyFound) throw "no rule of name " + rule.dependencyName + " was found";
        }
        rules.push(rule);
    };

    //set a rule state on an individual cell
    self.setState = function(x,y,name,value){
        if(currentBoard[x] === undefined || currentBoard[x][y] === undefined) throw "out of bounds of board";
        var nameFound = false;
        rules.forEach(function(rule){
            if(rule.getName() === name)
                nameFound = true;
        });
        if(!nameFound) throw "no rule found for \"" + name + "\"";
        currentBoard[x][y][name] = value;
    };

    self.run = function(){
        //the next board that we populate from running rules on the current board
        var nextBoard = makeBoard();
        //loop through all positions in board
        for(var y = 0; y < height; y++){
            for(var x = 0; x < width; x++){
                //run rules on the cell
                for(var i = 0; i < rules.length;i++){
                    var rule = rules[i];
                    //if the rule isn't dependent on a previous rule, run it on the current board
                    var result = rule.hasDependency? rule.run(nextBoard,x,y,currentBoard[x][y][rule.getName()]) : rule.run(currentBoard,x,y);
                    //make sure the result hasn't already been populated
                    if(result.name === undefined || result.value === undefined) throw "rule isn't complete";
                    if(nextBoard[x][y][result.name] !== undefined) throw "rule has already been applied";
                    //set rule in next board
                    nextBoard[x][y][result.name] = result.value;
                }
            }
        }
        //set the current board to the one that we've been creating
        currentBoard = nextBoard;
    };

    self.getCell = function(x,y){
        if(currentBoard[x] === undefined || currentBoard[x][y] === undefined) throw "out of board bounds";
        return currentBoard[x][y];
    };

    self.printBoard = function(){
        console.log(currentBoard);
    };

    return self;
};