var View       = require('famous/core/View');
var Surface    = require('famous/core/Surface');
var Modifier   = require('famous/core/Modifier');
var Transform  = require('famous/core/Transform');
var GridLayout = require('famous/views/GridLayout');
var CubicView  = require('./CubicView');
var GridAnimations = require('./GridAnimations');

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
    _loadAnimations.call(this);
    // _createTestCube.call(this);
}

CubicGridView.prototype = Object.create(View.prototype);
CubicGridView.prototype.constructor = CubicGridView;

CubicGridView.DEFAULT_OPTIONS = {
    dimensions : [10, 10],
    size : [500, 500],
};

function _loadAnimations () {
    //load all the animations into prototype
    for(var animationName in GridAnimations) {
        CubicGridView.prototype[animationName] = GridAnimations[animationName].bind(this);
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
