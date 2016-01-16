/**
 * Created by brenden on 1/16/2016.
 */
var UI = function(options) {
    var self = this instanceof UI ? this : Object.create(UI.prototype);

    //if(options === undefined) throw "must define options";
    //if(options.playPause === undefined) throw "playPause must be defined";
    //if(typeof options.playPause !== "function") throw "playPause must be a function";
    //if(options.slower === undefined) throw "slower must be defined";
    //if(typeof options.slower !== "function") throw "slower must be a function";
    //if(options.faster === undefined) throw "faster must be defined";
    //if(typeof options.faster !== "function") throw "faster must be a function";
    //if(options.step === undefined) throw "step must be defined";
    //if(typeof options.step !== "function") throw "step must be a function";

    //var playPause = options.playPause;
    //var slower = options.slower;
    //var faster = options.faster;
    //var step = options.step;

    //keeping track of UI state
    var playSpeed = 2;
    var speedOptions = [2000,1000,500,250,125,0];
    var playState = "paused";

    self.getFrameDelay = function(){
        return speedOptions[playSpeed];
    };

    self.isPlaying = function(){
        return playState === "playing";
    }

    var buttons = [
        {
            element : document.getElementById("playPause"),
            paused : {
                class : "fa fa-play",
                visible : true
            },
            playing : {
                class : "fa fa-pause",
                visible : true
            },
            click : function(){
                console.log("Play / Pause clicked");
                playState = playState === "paused" ? "playing" : "paused";
                setButtonStates(playState);
            }
        },
        {
            element : document.getElementById("slower"),
            paused : {
                visible: true,
                class : "fa fa-backward"
            },
            playing : {
                visible : true,
                class : "fa fa-backward"
            },
            click : function(){
                if(playSpeed > 0) playSpeed--;
            }
        },
        {
            element : document.getElementById("faster"),
            paused : {
                visible : true,
                class : "fa fa-forward"
            },
            playing : {
                visible : true,
                class : "fa fa-forward"
            },
            click : function(){
                if(playSpeed < speedOptions.length-1) playSpeed++;
            }
        },
        {
            element : document.getElementById("step"),
            paused : {
                visible : true,
                class : "fa fa-fast-forward"
            },
            playing : {
                visible : false
            },
            click : function(){
                board.run();
                renderer.render(board);
                console.log("step one simulation frame");
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
            }
            else{
                button.element.visible = false;
            }
            button.element.appendChild(icon);
            button.element.onclick=button.click;
        });
    }
    setButtonStates(playState);


    var optionsShowing = false;
    var optionsButton = document.getElementById("options");
    optionsButton.onclick = function(){
        console.log("options");
    };


    return self;
}