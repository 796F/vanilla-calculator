var Engine = require('famous/core/Engine');
var CubicGridView = require('./views/CubicGridView');
var CalculatorView = require('./views/CalculatorView');
require('./styles');

var mainContext = Engine.createContext();

var app = new CalculatorView();

mainContext.setPerspective(800);
mainContext.add(app);

window.app = app;
