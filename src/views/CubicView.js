var View           = require('famous/core/View');
var Surface        = require('famous/core/Surface');
var Transform      = require('famous/core/Transform');
var Modifier       = require('famous/core/Modifier');
var Transitionable = require('famous/transitions/Transitionable');
var StateModifier  = require('famous/modifiers/StateModifier');
var Easing         = require('famous/transitions/Easing');

var CUBE_TRANSITION = { duration: 700, curve: Easing.inOutElastic };

var NINETY_DEGRESS = Math.PI/2;

var FACE_ROTATIONS = [
    [0, 0, 0],                    //FRONT
    [-NINETY_DEGRESS, 0, 0],    //RIGHT
    [NINETY_DEGRESS, 0, 0],     //RIGHT
    [0, -NINETY_DEGRESS, 0],    //BOTTOM
    [0, NINETY_DEGRESS, 0],     //TOP 
    [2 * NINETY_DEGRESS, 0, 0],   //BACK  
]

function CubicView() {
    View.apply(this, arguments);

    this._flipEndState = [0, 0, 0];

    this._reversalChain = [];
    this._faces = [];

    this._cubeRotationState = new Transitionable([0, 0, 0]);
    this._cubeTranslationState = new Transitionable([0, 0, 0]);

    this._rotationModifier = new Modifier({
        origin :[0.5, 0.5],
        align: [0.5, 0.5],
        transform: function() {
            var state = this._cubeRotationState.get();
            return Transform.rotate(state[0], state[1], state[2]);
        }.bind(this)
    });

    this._translationModifier = new Modifier({
        transform : function () {
            var state = this._cubeTranslationState.get();
            return Transform.translate(state[0], state[1], state[2]);
        }.bind(this)
    })

    this._rootNode = this.add(this._rotationModifier).add(this._translationModifier);
    var intervalId = setInterval(function() {
        var i = Math.round(Math.random() * 5);
        this.flipTo(i);
        this.shiftTo(i%2);
    }.bind(this), 2000 + Math.round(Math.random() * 1000));
    
    _createFaces.call(this);

}

CubicView.prototype = Object.create(View.prototype);
CubicView.prototype.constructor = CubicView;

CubicView.DEFAULT_OPTIONS = {
    // width : undefined,
    // height : undefined, 
    width : 50,
    height : 50,
    depth : 100
};

function _vecSum(a, b) {
    var res = [];
    for(var i=0; i<a.length; i++){
        res[i] = a[i] + b[i];
    }
    return res;
}
CubicView.prototype.shiftTo = function shiftTo(state) {
    if(state == 0) {
        this._cubeTranslationState.set([0, 0, 0], CUBE_TRANSITION);
    }else{
        this._cubeTranslationState.set([0, 0, 50], CUBE_TRANSITION);
    }
    
}

CubicView.prototype.flipTo = function flipTo(index) {
    this.reverseRotations(function() {
        //finished reversing the rotations.
        var currentState = this._flipEndState;

        this._flipEndState = FACE_ROTATIONS[index].map(function(n) { return -n }); 
        this._reversalChain.push(FACE_ROTATIONS[index]);

        //generate stateArray from
        console.log('generate state Array for flip from', currentState, 'and', this._flipEndState);
        var states = _createStateArray(currentState, this._flipEndState);
        
        _flipChain.call(this, states);
        // this._cubeRotationState.set(this._flipEndState, CUBE_TRANSITION);
    }.bind(this));
}

CubicView.prototype.reverseRotations = function reverseRotations(callback) {
    console.log('called reverse, chain has', this._reversalChain.length);
    if(this._reversalChain.length == 0) return callback();

    for(var i = 0; i<this._reversalChain.length; i++) {
        var reversal = this._reversalChain.pop();
        var currentState = this._flipEndState;
        this._flipEndState = _vecSum(this._flipEndState, reversal);

        //generate stateArray from 
        console.log('generate state Array for Reversal from', currentState, 'and', this._flipEndState);
        var states = _createStateArray(currentState, this._flipEndState);
        // _flipChain(states, callback).bind(this);

        _flipChain.call(this, states, callback);
        // this._cubeRotationState.set(this._flipEndState, CUBE_TRANSITION, callback);
    }
}

function _createStateArray (start, end) {
    //generate an array of states that go from start to end.  
    var states = [];
    for(var i=0; i<start.length; i++){
        var sign = start[i] < end[i] ? 1 : -1; //add if less than, subtract if more than.
        while(start[i] != end[i]) {
            var tmp = [0, 0, 0]
            tmp[i] = start[i]+= sign * NINETY_DEGRESS;
            states.push(tmp);
        }
    }
    return states;
}

function _flipChain (stateArray, callback) {
    var self = this;
    if(stateArray.length == 0) {
        if(callback) callback();
    }else{
        var state = stateArray.shift(); //get from head
        console.log('going to state', state);
        self._cubeRotationState.set(state, CUBE_TRANSITION, function() {
            _flipChain.call(self, stateArray, callback);
        });    
    }
    
}

function _createFaces() {
    var self = this;
    for(var i=0; i<FACE_ROTATIONS.length; i++){
        var face = new Surface({
          content: 'surf ' + i,
          classes: ['backfaceVisibility'],
          size: [self.options.width, self.options.height],
          properties: {
            color: 'white',
            textAlign: 'center',
            lineHeight: '100px',
            backgroundColor: 'black'
            // backgroundColor: 'hsl(' + (i * 360 / 3) + ', 100%, 50%)'
          }
        });
        var face_loc = FACE_ROTATIONS[i];
        var rMod = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: Transform.rotate(face_loc[0], face_loc[1], face_loc[2])
        });
        
        var zMod = new Modifier({
            transform: Transform.translate(0, 0, self.options.width/2)
        });

        self._faces.push(face);
        self._rootNode.add(rMod).add(zMod).add(face);
    }
}


module.exports = CubicView;
