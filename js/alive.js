/**
 * Created by brenden on 1/16/2016.
 */
var LiveRule = function(options){
    var self = this instanceof LiveRule ? this : Object.create(LiveRule.prototype);
    NeighborChecker.call(self,options);

    var name = "alive";
    self.getName = function(){return name;};

    var neighborsLiving = 0;
    var checkNeighborLiving = function(cell){
        if(cell[name]) neighborsLiving++;
    };

    self.run = function(board,x,y){
        self.checkNeighbors(board,x,y,checkNeighborLiving.bind(this));
        var alive = false;
        //cell is alive
        if(board[x][y][name]){
            //2 to 3 live neighbors, cell lives on
            if(neighborsLiving >= 2 && neighborsLiving <= 3)
                alive = true;
            //else cell is dead
        }
        //cell is dead
        else{
            //three neighbors, cell is born
            if(neighborsLiving === 3)
                alive = true;
            //else cell is dead
        }
        //zero out neighbors for next cell
        neighborsLiving = 0;
        return {name : name, value : alive}
    };

    return self;
};
LiveRule.prototype = Object.create(NeighborChecker.prototype);