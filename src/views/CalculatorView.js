var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');
var CubicGridView = require('./CubicGridView');

var KEYS = [
    
]

function CalculatorView() {
    View.apply(this, arguments);


    _createKeyboard.call(this);

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

   this.add(this._keybaord);
}

module.exports = CalculatorView;
