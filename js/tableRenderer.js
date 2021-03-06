/**
 * Created by brenden on 1/16/2016.
 */
var TableRenderer = function(options){
    var self = this instanceof TableRenderer ? this : Object.create(TableRenderer.prototype);

    if(options === undefined) throw "must define options";
    if(options.element === undefined) throw "must define element";
    if(!options.element instanceof HTMLElement) throw "element not an HTMLElement";
    if(options.click === undefined) throw "must define click handler";
    if(typeof options.click !== "function") throw "click handler must be a function";
    if(options.width === undefined || typeof options.width !== "number") throw "width not properly defined";
    if(options.height === undefined || typeof options.height !== "number") throw "height not properly defined";

    var element = options.element;
    var clickHandler = options.click;
    var width = options.width;
    var height = options.height;

    var tableElement;

    //we'll hold references to table cells in here when we make them
    var makeCells = function(){
        var temp = new Array(width);
        for(var i = 0; i < width; i++){
            temp[i] = new Array(height);
        }
        return temp;
    };
    var cells = makeCells();



    var makeTable = function(){
        //clear any content from the table
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
        //create the table
        tableElement = document.createElement("table");
        tableElement.style.width="100%";
        tableElement.style.height="100%";
        element.appendChild(tableElement);

        //create rows
        for(var y = 0; y < height; y++){
            var tableRow = document.createElement("tr");
            //add individual cells
            for(var x = 0; x < width; x++){
                var cell = document.createElement("td");
                cells[x][y] = cell;
                //iife so x and y don't change
                (function(){
                    var xVal = x;
                    var yVal = y;
                    cell.onclick = function(){clickHandler(xVal,yVal)};
                })();
                tableRow.appendChild(cell);
            }
            tableElement.appendChild(tableRow);
        }
    };
    makeTable();

    self.makeNewTable = function(newWidth,newHeight){
        if(newWidth === undefined || typeof newWidth !== "number") throw "improper width";
        if(newHeight=== undefined || typeof newHeight!== "number") throw "improper height";
        width = newWidth;
        height = newHeight;
        cells = makeCells();
        makeTable();
    };



    self.render = function(board){
        for(var x = 0; x < width; x++){
            for(var y = 0; y < height; y++){
                //first do "alive"
                if(board.getCell(x,y)["alive"]){
                    var rgb = hexToRGB(board.getCell(x,y).color);
                    cells[x][y].style["background-color"] = "rgba(" + rgb[0] +"," + rgb[1] + "," + rgb[2] + "," + (board.getCell(x,y).opacity / 10) + ")";
                    cells[x][y].className = "alive";
                }
                //cell is dead
                else{
                    cells[x][y].style["background-color"] = null;
                    cells[x][y].className = null;
                }
            }
        }
    };

    //shamelessly stolen from
    //http://www.javascripter.net/faq/hextorgb.htm
    var hexToRGB = function(color){
        function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
        function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
        function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
        function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
        return [hexToR(color),hexToG(color),hexToB(color)];
    };

    return self;
};