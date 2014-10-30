var View           = require('famous/core/View');
var Surface        = require('famous/core/Surface');
var Transform      = require('famous/core/Transform');
var Modifier       = require('famous/core/Modifier');
var Transitionable = require('famous/transitions/Transitionable');
var StateModifier  = require('famous/modifiers/StateModifier');
var Easing         = require('famous/transitions/Easing');
var EventHandler   = require('famous/core/EventHandler');

var CUBE_TRANSITION = { duration: 500, curve: Easing.inOutElastic };
var CUBE_TRANSITION = { duration: 500, curve: Easing.inQuad };
var CUBE_TRANSITION = { duration: 500, curve: Easing.outQuad };
var CUBE_TRANSITION = { duration: 500, curve: Easing.inOutQuad };
var CUBE_TRANSITION = { duration: 500, curve: Easing.inCubic };
var CUBE_TRANSITION = { duration: 500, curve: Easing.outCubic };
var CUBE_TRANSITION = { duration: 500, curve: Easing.inOutCubic };

// var CUBE_TRANSITION = { duration: 500, curve: Easing.inOutSine };
// var CUBE_TRANSITION = { duration: 500, curve: Easing.inOutExpo };
// var CUBE_TRANSITION = { duration: 500, curve: Easing.inOutCirc };
// var CUBE_TRANSITION = { duration: 500, curve: Easing.inOutBounce };

var NINETY_DEGRESS = Math.PI/2;

var FACE_ROTATIONS = [
    [0, 0, 0],                    //FRONT
    [-NINETY_DEGRESS, 0, 0],      //LEFT
    [NINETY_DEGRESS, 0, 0],       //RIGHT
    [0, -NINETY_DEGRESS, 0],      //BOTTOM
    [0, NINETY_DEGRESS, 0],       //TOP 
    [2 * NINETY_DEGRESS, 0, 0],   //BACK  
]

var FACE_COLORS = [
    'black',    //off mode == 0
    'white',    //on mode  == 1
    'black',    //custom button 1
    'black',    //custom button 2
    'black',    //custom button 3
    'black',    //custom button 4
]

var SYMBOL_FACE_MAP = {
    '1' : 0,    //the one number is on face at index 0
    '%' : 1, 
    'sqrt' : 2,
}

function CubicView() {
    View.apply(this, arguments);

    this._flipEndState = [0, 0, 0];
    this._currentFaceIndex = 0;
    this._currentShiftState = 0;
    this._cubeRotationState = new Transitionable([0, 0, 0]);
    this._cubeTranslationState = new Transitionable([0, 0, 0]);

    this._reversalChain = [];
    this._faces = [];

    this._index = this.options.index;
    this._rotationModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: function() {
            var state = this._cubeRotationState.get();
            // return Transform.rotate(state[0], state[1], state[2]);
            return Transform.rotate.apply(this, state);
        }.bind(this)
    });

    this._translationModifier = new Modifier({
        transform : function () {
            var state = this._cubeTranslationState.get();
            return Transform.translate.apply(this, state);
        }.bind(this)
    })

    this._rootNode = this.add(this._translationModifier).add(this._rotationModifier);
    
    _createCube.call(this);
}

CubicView.prototype = Object.create(View.prototype);
CubicView.prototype.constructor = CubicView;

CubicView.DEFAULT_OPTIONS = {
    width : 50,
    height : 50,
    edgeLength : 50,
    translation : 25
};

CubicView.prototype.toggleJiggle = function() {
    if(this.jiggling) {
        clearInterval(this.jiggling);
        this.halt();
        this.jiggling = undefined;
    }else{
        // make jiggle
        this.jiggling = setInterval(function() {
            var i = Math.round(Math.random() * 5);
            this.flipTo(i);
            this.shiftTo(i%4 - 1);
        }.bind(this), 2000 + Math.round(Math.random() * 1000));
    }
}

CubicView.prototype.returnToStart = function(delay, callback) {
    var self = this;
    if(delay instanceof Function) callback = delay, delay = 0;

    self.flipTo(0, delay, function() {
        self.shiftTo(0, delay, function() {
            if(callback) return callback();
        });
    });
}

CubicView.prototype.halt = function() {
    this.shiftTo(this._currentShiftState);
    this.flipTo(this._currentFaceIndex);
}

CubicView.prototype.popFlipReturn = function popFlipReturn(index, popDirection, delay, callback) {
    var self = this;

    if(delay instanceof Function) callback = delay, delay = 0;
    
    self.shiftTo(popDirection, delay, function() {
        self.flipTo(index, delay, function() {
            self.shiftTo(0, delay, callback);
        });
    });
}

CubicView.prototype.shiftTo = function shiftTo(state, delay, callback) {
    if(delay instanceof Function) callback = delay, delay = 0;
    
    this._currentShiftState = state;
    this._cubeTranslationState.delay(delay);
    this._cubeTranslationState.set([0, 0, state * this.options.edgeLength], CUBE_TRANSITION, callback);
}

CubicView.prototype.flipTo = function flipTo(index, delay, callback) {
    var self = this;
    if(delay instanceof Function) callback = delay, delay = 0;

    self._currentFaceIndex = index;
    
    self._cubeRotationState.delay(delay);
    self.reverseRotations(function() {
        //finished reversing the rotations.
        var currentState = self._flipEndState;

        self._flipEndState = FACE_ROTATIONS[self._currentFaceIndex].map(function(n) { return -n }); 
        self._reversalChain.push(FACE_ROTATIONS[self._currentFaceIndex]);

        var states = _createStateArray(currentState, self._flipEndState);        
        _flipChain.call(self, states, callback);
    });
}

CubicView.prototype.reverseRotations = function reverseRotations(callback) {
    if(this._reversalChain.length == 0) return callback();

    for(var i = 0; i<this._reversalChain.length; i++) {
        var reversal = this._reversalChain.pop();
        var currentState = this._flipEndState;
        this._flipEndState = _vecSum(this._flipEndState, reversal);

        var states = _createStateArray(currentState, this._flipEndState);
        _flipChain.call(this, states, callback);
    }
}

function _flipChain (stateArray, delay, callback) {
    if(delay instanceof Function) callback = delay, delay = 0;

    var self = this;
    if(stateArray.length == 0) {
        if(callback) callback();
    }else{
        var state = stateArray.shift(); 
        self._cubeRotationState.set(state, CUBE_TRANSITION, function() {
            _flipChain.call(self, stateArray, callback);
        });    
    }
    
}

function _vecSum(a, b) {
    var res = [];
    for(var i=0; i<a.length; i++){
        res[i] = a[i] + b[i];
    }
    return res;
}

function _createStateArray (start, end) {
    //generate an array of states that goes from start to end face by face.  
    var states = [];
    for(var i=0; i<start.length; i++){
        var sign = start[i] < end[i] ? 1 : -1; //add if less than, subtract if more than.
        while(start[i] != end[i]) {
            var tmp = [0, 0, 0]
            tmp[i] = start[i]+= sign * NINETY_DEGRESS;
            states.push(tmp);
        }
    }
    if(states.length == 0) states.push(end);
    return states;
}

function _createCube() {
    var self = this;
    for(var i=0; i<FACE_ROTATIONS.length; i++){
        // var face = _createFace.call(this, i, '' + i);
        var face = _createFace.call(this, i);
        // var rMod = new Modifier({
        //     opacity : 0.9,
        //     transform: Transform.rotate.apply(self, FACE_ROTATIONS[i]) 
        // });
        var zMod = new Modifier({
            //TODO HOW TO GET RENDERED WIDTH?
            // transform: Transform.translate(0, 0, this.options.edgeLength * 0.5)
            transform: Transform.multiply(
                Transform.rotate.apply(self, FACE_ROTATIONS[i]),
                Transform.translate(0, 0, this.options.edgeLength * 0.5)
            )
        });



        self._faces.push(face);
        // self._rootNode.add(rMod).add(zMod).add(face);
        self._rootNode.add(zMod).add(face);
    }
}

function _createFace(index, content) {
    var face = new Surface({
      content: content,
      classes: ['backfaceVisibility'],
      size: [this.options.edgeLength, this.options.edgeLength],
      properties: {
        color: 'white',
        textAlign: 'center',
        lineHeight: '50px',
        fontSize: '35px',
        // border: '1px solid white',
        // backgroundColor: FACE_COLORS[i]
        backgroundColor: 'hsl(' + (index * 36 / 3) + ', 80%, 40%)'
      }
    });
    
    face.on('mousedown', function() {
        console.log('mdown on cube', this._index, 'face', index);
    }.bind(this));

    face.on('mouseup', function() {
        console.log('mouseup on cube', this._index, 'face', index);
    }.bind(this));

    return face;
}

module.exports = CubicView;
