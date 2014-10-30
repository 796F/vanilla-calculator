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
    this.numberOfCubes = this.options.dimensions[0] * this.options.dimensions[1];
    this._cubeStyleMap = {};

    //force to square with the X dimension, ignore height.  
    this._gridWidthPixel = this.options.size[0];
    this._gridHeightPixel = this._gridWidthPixel;

    this._gridWidth = this.options.dimensions[0];
    this._gridHeight = this._gridWidth;

    this._rootModifier = new Modifier({
        size: [this._gridWidthPixel, this._gridHeightPixel]
    });

    this._rootNode = this.add(this._rootModifier);
    
    //create cube layout
    _formatCubeStyles.call(this);
    _createCubicLayout.call(this);
    _loadAnimations.call(this);
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

function _createCubicLayout() {
    var cubeSize = this.options.size[0]/this.options.dimensions[0];

    for(var i = 0; i<this.numberOfCubes; i++) {
        var cubeOpts = {
            index : i,
            edgeLength : cubeSize,
        }
        if(this._cubeStyleMap[i]) cubeOpts.cubeStyle = this._cubeStyleMap[i];
        
        this._cubes.push(new CubicView(cubeOpts));
    }

    this._gridLayout = new GridLayout({
        dimensions: this.options.dimensions
    });

    this._gridLayout.sequenceFrom(this._cubes);
    this._rootNode.add(this._gridLayout);
}

function _formatCubeStyles() {
    for(var i=0; i<this.options.cubeStyleMap.length; i++) {
        var cubeStyle = this.options.cubeStyleMap[i];
        var cubeIndex = cubeStyle.coordinate[0] * this._gridWidth + cubeStyle.coordinate[1];
        this._cubeStyleMap[cubeIndex] = cubeStyle.style;
    }
}

//debug 

function _createTestCube() {
    var cubeSize = (this.options.size[0] * this.options.size[1]) / this.numberOfCubes
    var cube = new CubicView({
        edgeLength : cubeSize
    });
    this._cubes.push(cube);
    this._rootNode.add(cube);
}

module.exports = CubicGridView;

