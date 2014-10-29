var View       = require('famous/core/View');
var Surface    = require('famous/core/Surface');
var Modifier   = require('famous/core/Modifier');
var Transform  = require('famous/core/Transform');
var GridLayout = require('famous/views/GridLayout');
var CubicView  = require('./CubicView');

var KEYS = [
    
]

function CubicGridView() {
    View.apply(this, arguments);

    this._cubes = [];
    this._gridLayout;

    this._rootModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        size: this.options.size,
        transform: Transform.rotate(-Math.PI/4, Math.PI/4, 0)
    });

    this._rootNode = this.add(this._rootModifier);
    
    //create cube layout
    _createCubicLayout.call(this);
    // _createTestCube.call(this);
}

CubicGridView.prototype = Object.create(View.prototype);
CubicGridView.prototype.constructor = CubicGridView;

CubicGridView.DEFAULT_OPTIONS = {
    dimensions : [10, 10],
    size : [500, 500],
};

CubicGridView.prototype.randomFlipToIndex = function randomFlipToIndex(index) {
    //randomly go through all the cubes, and flip them to a certain side.
    var flipped = Array.apply(null, new Array(this._cubes.length)).map(Number.prototype.valueOf,0);
    while(flipped.indexOf(0) >= 0) {
        //while there are unflipped cubes
        var randomIndex = Math.round(Math.random() * (this._cubes.length-1));
        if(!flipped[randomIndex]) {
            this._cubes[randomIndex].flipTo(index, Math.round(Math.random() * 1000));
            flipped[randomIndex] = true;
        }
        setTimeout(10 * randomIndex);
    }
}

CubicGridView.prototype.randomPopReturnToIndex = function(index) {
    var flipped = Array.apply(null, new Array(this._cubes.length)).map(Number.prototype.valueOf,0);
    while(flipped.indexOf(0) >= 0) {
        //while there are unflipped cubes
        var randomIndex = Math.round(Math.random() * (this._cubes.length-1));
        if(!flipped[randomIndex]) {
            var shiftMagnitude = Math.round(Math.random() * 2);
            this._cubes[randomIndex].popFlipReturn(index, Math.random() > 0.5 ? shiftMagnitude : -shiftMagnitude , Math.round(Math.random() * 1000));
            flipped[randomIndex] = true;
        }
        setTimeout(10 * randomIndex);
    }
}

CubicGridView.prototype.orderlyFlipToIndex = function orderlyFlipToIndex(index) {
    for(var i=0; i<this._cubes.length; i++) {
        this._cubes[i].flipTo(index, 30 * i);
    }
}

CubicGridView.prototype.clean = function clean() {
    for(var i=0; i<this._cubes.length; i++) { 
        this._cubes[i].shiftTo(0); 
        this._cubes[i].flipTo(0); 
    }
}

function _createTestCube() {
    var cube = new CubicView({});
    this._cubes.push(cube);
    this._rootNode.add(cube);
}

function _createCubicLayout() {
    for(var i = 0; i<this.options.dimensions[0] * this.options.dimensions[1]; i++) {
        this._cubes.push(new CubicView({
            index : i
        }));
    }

    this._gridLayout = new GridLayout({
        dimensions: this.options.dimensions
    });

    this._gridLayout.sequenceFrom(this._cubes);
    this._rootNode.add(this._gridLayout);
}

module.exports = CubicGridView;
