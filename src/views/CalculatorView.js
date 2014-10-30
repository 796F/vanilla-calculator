var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var Transitionable = require('famous/transitions/Transitionable');
var StateModifier = require('famous/modifiers/StateModifier');
var CubicGridView = require('./CubicGridView');
var Modifier   = require('famous/core/Modifier');


//keys must tell styles and stuff of each cube.
//ex 0 is the power key, 1 - 4 are completely hidden.  

var HIDDEN_CUBE = [
    { color: 'black', content: '', backgroundColor: 'white' },    //off mode == 0
    { color: 'black', content: '', backgroundColor: 'white' },    //on mode  == 1
    { color: 'black', content: '', backgroundColor: 'white' },    
    { color: 'black', content: '', backgroundColor: 'white' },    
    { color: 'black', content: '', backgroundColor: 'white' },    
    { color: 'black', content: '', backgroundColor: 'white' },
]

var NUM_BGCOLOR = 'black';
var NUM_COLOR = 'white';
var OFF_MODE = { color: 'black', content: '', backgroundColor: 'black' };


var TOP_ROW_KEYS = [
    { 
        coordinate: [0, 0], 
        style: [
            { color: 'black', content: 'O', backgroundColor: 'white' },    //off mode == 0
            { color: 'black', content: 'X', backgroundColor: 'white' },    //on mode  == 1
        ] 
    },
    { coordinate: [0, 1], style: HIDDEN_CUBE },
    { coordinate: [0, 2], style: HIDDEN_CUBE },
    { coordinate: [0, 3], style: HIDDEN_CUBE },
    { coordinate: [0, 4], style: HIDDEN_CUBE },
]

var NUM_PAD_KEYS = [
    { coordinate: [1, 0], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '7', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym1', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [1, 1], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '8', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym2', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [1, 2], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '9', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym3', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [2, 0], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '4', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym4', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [2, 1], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '5', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym5', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [2, 2], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '6', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym6', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [3, 0], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '1', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym7', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [3, 1], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '2', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym8', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [3, 2], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '3', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym9', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [4, 1], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '0', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] }
]

var OPERATOR_KEYS = [
    { coordinate: [4, 0], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: 'sym', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } 
                                 ] },
    { coordinate: [1, 3], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '/', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [1, 4], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: 'Clr', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [2, 3], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: 'X', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [2, 4], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '+/-', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [3, 3], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '-', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [3, 4], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '%', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [4, 3], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '+', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [4, 4], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '=', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] },
    { coordinate: [4, 2], style: [ OFF_MODE, 
                                   { color: NUM_COLOR, content: '.', backgroundColor: NUM_BGCOLOR }, 
                                   { color: NUM_COLOR, content: 'sym10', backgroundColor: NUM_BGCOLOR } ] }
]

function CalculatorView() {
    View.apply(this, arguments);

    this._sceneTransitionable = new Transitionable([0, 0, 0]);
    this._sceneModifier = new Modifier({
        // align: [0.5, 0.5],
        // origin: [0.5, 0.5],
        transform: function() {
            return Transform.rotate.apply(this, this._sceneTransitionable.get())  ;
        }.bind(this)
    });

    this._rootNode = this.add(this._sceneModifier);

    _createKeyboard.call(this);
    _createScreen.call(this);
    _createPowerButton.call(this);
}

CalculatorView.prototype = Object.create(View.prototype);
CalculatorView.prototype.constructor = CalculatorView;

CalculatorView.DEFAULT_OPTIONS = {};

function _createScreen() {
    this._screenModifier = new Modifier({
        align: [0, 0],
        origin: [0, 0]
    });

    this._screen = new Surface({
        content: 'TEXT',
        size : [320, 248],
        properties: {
            color: 'black',
            border: '1px solid black'
        }
    });

    this._rootNode.add(this._screenModifier).add(this._screen);
}
function _createKeyboard() {
    this._keyboardModifier = new Modifier({
        align: [0, 1],
        origin: [0, 1]
    });



    this._keyboard = new CubicGridView({
      size : [320, 320],
      dimensions: [5, 5],
      cubeStyleMap: TOP_ROW_KEYS.concat(NUM_PAD_KEYS).concat(OPERATOR_KEYS)    //map of custom cube styles to apply to each cube.  
    });

    this._rootNode.add(this._keyboardModifier).add(this._keyboard);
}


function _createPowerButton() {

}

module.exports = CalculatorView;
