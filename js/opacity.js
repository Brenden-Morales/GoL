/**
 * Created by brenden on 1/17/2016.
 */
var OpacityRule = function(options){
    var self = this instanceof OpacityRule ? this : Object.create(OpacityRule.prototype);

    //this rule depends on the "alive" rule already being run
    self.hasDependency = true;
    self.dependencyName = "alive";

    var name = "opacity";
    self.getName = function(){return name;};

    self.run = function(board,x,y,previousBoard){
        var opacity = 0;
        var previousValue = previousBoard[x][y][name];
        if(board[x][y][self.dependencyName]){
            if(previousValue === undefined)
                opacity = 1;
            else if(previousValue < 10)
                opacity = previousValue + 1;
            else if(previousValue === 10)
                opacity = previousValue;

        }
        return {name : name, value : opacity}
    };

    return self;
};