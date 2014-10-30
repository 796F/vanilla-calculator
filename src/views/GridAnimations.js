var Animations = {};

Animations.popFigure = function showFigure(figureName, state) {
  if(state == undefined) state = 1;

  var toPop = Object.create(FIGURES[figureName]);
  while(toPop.indexOf(1) >= 0) {
      //while there are unflipped cubes
      var randomIndex = Math.round(Math.random() * (toPop.length-1));
      if(toPop[randomIndex] == 1) {
        this._cubes[randomIndex].shiftTo(state, Math.round(Math.random() * 1000));
        toPop[randomIndex] = 0;
      }
  }
}

Animations.flipFigure = function flipFigure(figureName, index) {
  if(index == undefined) index = 1;
  var toFlip = Object.create(FIGURES[figureName]);
  while(toFlip.indexOf(1) >= 0) {
      //while there are unflipped cubes
      var randomIndex = Math.round(Math.random() * (toFlip.length-1));
      if(toFlip[randomIndex] == 1) {
        this._cubes[randomIndex].flipTo(index, Math.round(Math.random() * 1000));
        toFlip[randomIndex] = 0;
      }
  }
}

Animations.flatten = function flatten () {
  var flipped = Array.apply(null, new Array(this._cubes.length)).map(Number.prototype.valueOf,0);
  while(flipped.indexOf(0) >= 0) {
      //while there are unflipped cubes
      var randomIndex = Math.round(Math.random() * (this._cubes.length-1));
      if(!flipped[randomIndex]) {
          this._cubes[randomIndex].returnToStart(Math.round(Math.random() * 1000));
          flipped[randomIndex] = true;
      }
  }
}

Animations.toggleJiggle = function toggleJiggle() {
  for(var i=0; i<this._cubes.length; i++){
      this._cubes[i].toggleJiggle();
  }
}

Animations.diagonalFlipToIndex = function diagonalFlipToIndex(index) {}

Animations.randomFlipToIndex = function randomFlipToIndex(index) {
    //randomly go through all the cubes, and flip them to a certain side.
    var flipped = Array.apply(null, new Array(this._cubes.length)).map(Number.prototype.valueOf,0);
    while(flipped.indexOf(0) >= 0) {
        //while there are unflipped cubes
        var randomIndex = Math.round(Math.random() * (this._cubes.length-1));
        if(!flipped[randomIndex]) {
            this._cubes[randomIndex].flipTo(index, Math.round(Math.random() * 1000));
            flipped[randomIndex] = true;
        }
    }
}

Animations.randomPopReturnToIndex = function randomPopReturnToIndex(index) {
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

Animations.orderlyFlipToIndex = function orderlyFlipToIndex(index) {
    for(var i=0; i<this._cubes.length; i++) {
        this._cubes[i].flipTo(index, 30 * i);
    }
}

var FIGURES = {
  CLEAR : [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ],
  FAMOUS : [
    0, 0, 0, 1, 0, 1, 1, 1, 0, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 0, 0, 1, 0, 1, 0, 1, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0
  ],
  HEART  :[
    0, 0, 1, 0, 0, 0, 0, 1, 0, 0,
    0, 1, 1, 1, 0, 0, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 0, 0, 0, 0
  ],
}

module.exports = Animations;
