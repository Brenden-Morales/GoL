/**
 * Created by brenden on 1/16/2016.
 */
var UI = function(options) {
    var self = this instanceof UI ? this : Object.create(UI.prototype);

    if(options === undefined) throw "options must be defined";
    if(options.width === undefined || typeof options.width !== "number") throw "width must be defined";
    if(options.height === undefined || typeof options.height !== "number") throw "height must be defined";
    if(options.clearBoard === undefined) throw "clearBoard must be defined";
    if(typeof options.clearBoard !== "function") throw "clearBoard must be a function";
    if(options.render === undefined) throw "render must be defined";
    if(typeof options.render !== "function") throw "render must be a function";
    if(options.newTable === undefined) throw "must define a way to make a new table";
    if(typeof options.newTable !== "function") throw "newTable must be a function";
    if(options.newBoard === undefined) throw "must define a way to make a new board";
    if(typeof options.newBoard !== "function") throw "newBoard must be a function";

    //keeping track of UI state
    var playSpeed = 2;
    var speedOptions = [2000,1000,500,250,125,0];
    var speedNames = ["1/4 X", "1/2 X", "1X", "2X","4X","MAX"];
    var playState = "paused";

    var speedText = document.getElementById("speedText");
    var setSpeedName = function(name){
        speedText.className = null;
        if(name === undefined)speedText.innerHTML = speedNames[playSpeed];
        else speedText.innerHTML = name;
        setTimeout(function(){
            speedText.className = "fade-out";
        },100);
    };

    self.getFrameDelay = function(){
        return speedOptions[playSpeed];
    };

    self.isPlaying = function(){
        return playState === "playing";
    };

    //main button bar
    var buttons = [
        {
            element : document.getElementById("playPause"),
            paused : {
                class : "fa fa-play",
                title : "Start Running the Game",
                visible : true
            },
            playing : {
                class : "fa fa-pause",
                title : "Pause the Game",
                visible : true
            },
            click : function(){
                console.log("Play / Pause clicked");
                playState = playState === "paused" ? "playing" : "paused";
                setButtonStates(playState);
                setSpeedName();
            }
        },
        {
            element : document.getElementById("slower"),
            paused : {
                visible: true,
                title : "Decrease Game Speed",
                class : "fa fa-backward"
            },
            playing : {
                visible : true,
                title : "Decrease Game Speed",
                class : "fa fa-backward"
            },
            click : function(){
                if(playSpeed > 0) playSpeed--;
                setSpeedName();
            }
        },
        {
            element : document.getElementById("faster"),
            paused : {
                visible : true,
                title : "Increase Game Speed",
                class : "fa fa-forward"
            },
            playing : {
                visible : true,
                title : "Increase Game Speed",
                class : "fa fa-forward"
            },
            click : function(){
                if(playSpeed < speedOptions.length-1) playSpeed++;
                setSpeedName();
            }
        },
        {
            element : document.getElementById("step"),
            paused : {
                visible : true,
                title : "Move Game Forward One Step",
                class : "fa fa-fast-forward"
            },
            playing : {
                visible : false
            },
            click : function(){
                board.run();
                renderer.render(board);
                setSpeedName("Step");
            }
        }
    ];

    function setButtonStates(state){
        buttons.forEach(function(button){
            button.element.removeChild(button.element.firstChild);
            var icon = document.createElement("i");
            if(button[state].visible){
                icon.className = button[state].class;
                button.element.visible = true;
                button.element.title = button[state].title;
            }
            else{
                button.element.visible = false;
            }
            button.element.appendChild(icon);
            button.element.onclick=button.click;
        });
    }
    setButtonStates(playState);




    //the options bar
    var optionsShowing = false;
    var optionsButton = document.getElementById("options");
    var optionsArea = document.getElementById("optionsArea");
    optionsButton.onclick = function(){
        if(!optionsShowing){
            playState = "paused";
            setButtonStates(playState);
        }
        optionsShowing = !optionsShowing;
        optionsArea.style.visibility = optionsShowing ? null : "hidden";
    };


    //the clear button
    var clearBoard = options.clearBoard;
    var render = options.render;

    var clearBoardButton = document.getElementById("clearBoard");
    clearBoardButton.onclick = function(){
        clearBoard();
        render();
    };

    //the hide / show controls button
    var mainBar = document.getElementById("mainBar");
    var mainBarVisible = true;

    var hideControlsButton = document.getElementById("hideControls");
    var hideControlsIcon = document.getElementById("hideControlsIcon");
    var hideControlsText = document.getElementById("hideControlsText");
    hideControlsButton.onclick = function(){
        mainBarVisible = !mainBarVisible;
        if(!mainBarVisible){
            mainBar.style.visibility = "hidden";
            hideControlsText.innerText = "Show Controls";
            hideControlsIcon.className = "fa fa-eye optionIcon";

        }else{
            mainBar.style.visibility = null;
            hideControlsText.innerText = "Hide Controls";
            hideControlsIcon.className = "fa fa-eye-slash optionIcon";
        }
    };

    //grid width and height selector
    var newTable = options.newTable;
    var newBoard = options.newBoard;
    var width = options.width;
    var height = options.height;

    var heightInput = document.getElementById("heightInput");
    heightInput.value = height;
    heightInput.oninput = function(e){
        if(!isNaN(this.value)){
            var value = Number(this.value);
            if(value > 0){
                height = value;
                newBoard(width,height);
                newTable(width,height);
            }
        }
    };

    var widthInput = document.getElementById("widthInput");
    widthInput.value = width;
    widthInput.oninput = function(e){
        if(!isNaN(this.value)){
            var value = Number(this.value);
            if(value >0){
                width = value;
                newBoard(width,height);
                newTable(width,height);
            }
        }
    };


    //color selection
    //var lock = document.getElementById("lock");
    var lockIcon = document.getElementById("lockIcon");
    var colorDiv = document.getElementById("colorDiv");
    var colorPicker = document.getElementById("colorPicker");

    var colorLocked = true;

    //lock.onclick = function(){
    //    colorLocked = !colorLocked;
    //    if(!colorLocked){
    //        lockIcon.className = "fa fa-unlock-alt";
    //        lockIcon.title = "Lock Color"
    //    }
    //    else {
    //        lockIcon.className = "fa fa-lock";
    //        lockIcon.title = "Unlock Color";
    //    }
    //};

    var color = "#ff0000";
    self.getColor = function(){
        return color;
    };
    colorDiv.onclick = function(){
        colorPicker.click();
    };
    colorPicker.onchange = function(){
        console.log("color picker changed");
        color = this.value;
        colorDiv.style["background-color"] = color;
    };


    return self;
};