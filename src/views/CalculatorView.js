var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var Transitionable = require('famous/transitions/Transitionable');
var StateModifier = require('famous/modifiers/StateModifier');
var CubicGridView = require('./CubicGridView');
var Modifier   = require('famous/core/Modifier');

var KEYS = [
    
]

function CalculatorView() {
    View.apply(this, arguments);
    this._buttonCount = 0;

    this._sceneTransitionable = new Transitionable([0, 0, 0]);
    this._sceneModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: function() {
            return Transform.rotate.apply(this, this._sceneTransitionable.get())  ;
        }.bind(this)
    });
    
    this._rootNode = this.add(this._sceneModifier);

    _createKeyboard.call(this);
    _createButtons.call(this, 'flatten', 'flatten');
    _createButtons.call(this, 'toggle', 'toggleJiggle');
    _createButtons.call(this, 'famousPop', 'popFigure', ['FAMOUS', 1]);
    _createButtons.call(this, 'famousFlip', 'flipFigure', ['FAMOUS', 5]);
    _createButtons.call(this, 'randomFlipToIndex', 'randomFlipToIndex');
    _createButtons.call(this, 'randomPopReturnToIndex', 'randomPopReturnToIndex');
    _createButtons.call(this, 'orderlyFlipToIndex', 'orderlyFlipToIndex');

    var test = new Surface({
        content: 'hello',
        size: [50, 50], 
        properties : {
            backgroundColor: 'black'
        }
    });
    test.on('click', function() {
        var old_rotation = Object.create(this._sceneTransitionable.get());
        old_rotation[0] += 0.2;
        old_rotation[1] += 0.1;
        this._sceneTransitionable.set(old_rotation);
    }.bind(this))
    this.add(test);
}

CalculatorView.prototype = Object.create(View.prototype);
CalculatorView.prototype.constructor = CalculatorView;

CalculatorView.DEFAULT_OPTIONS = {};

function _createKeyboard() {
    
    this._keybaord = new CubicGridView({
      size : [500, 500],
      dimensions: [10, 10]
    });

    window.grid = this._keybaord;

   this._rootNode.add(this._keybaord);
}

function _createButtons(content, fnName, argsArray) {
    
    var mod = new StateModifier({
        origin : [1, 1],
        align: [0.8, 0.5]
    });

    var surf = new Surface({
        content: '<button>' + content + '</button>',
        size: [0, 0],
        properties: {
            borderRadius: '10px',
            textAlign: 'center',
            // backgroundColor: 'black',
            marginTop: this._buttonCount*25 + 'px',
        },
    })

    surf.on('click', function() {
        console.log(fnName);
        this._keybaord[fnName].apply(this, argsArray);
    }.bind(this));

    this.add(mod).add(surf);
    this._buttonCount++;
}

module.exports = CalculatorView;
