/**
 * Created by brenden on 1/17/2016.
 */
var ColorRule = function(options){
    var self = this instanceof ColorRule ? this : Object.create(ColorRule.prototype);

    //this rule depends on the "alive" rule already being run
    self.hasDependency = true;
    self.dependencyName = "alive";

    var name = "color";
    self.getName = function(){return name;};

    var getColor = function(initialX,initialY,previousBoard){
        //clockwise from left
        var order = [
            //left
            [-1,0],
            //top left
            [-1,-1],
            //top
            [0,-1],
            //top right
            [1,-1],
            //right
            [1,0],
            //bottom right
            [1,1],
            //bottom
            [0,1],
            //bottom left
            [-1,1]
        ];
        var rgbString = "#";
        for(var i = 0; i < order.length; i++){
            var x = initialX + order[i][0];
            var y = initialY + order[i][1];
            if(previousBoard[x]!== undefined && previousBoard[x][y] !== undefined){
                if(previousBoard[x][y]["alive"])
                    rgbString += previousBoard[x][y][name].substr(rgbString.length,2);
            }
        }
        if(rgbString.length !== 7) throw "color rule failed";
        return rgbString;
    };

    self.run = function(board,x,y,previousBoard){
        //if the board already has a color, take it
        var color = null;
        //if the cell was dead and is now alive, we need to give it a NEW color
        if(board[x][y]["alive"] && !previousBoard[x][y]["alive"]){
            color = getColor(x,y,previousBoard);
        }
        //if the cell was alive and is now dead, STRIP the color
        else if(!board[x][y]["alive"] && previousBoard[x][y]["alive"]){
            color = null;
        }
        //if the cell was alive and is now alive, KEEP the color
        else if(board[x][y]["alive"] && previousBoard[x][y]["alive"]){
            color = previousBoard[x][y][name];
        }
        return {name : name, value : color}
    };

    return self;
};