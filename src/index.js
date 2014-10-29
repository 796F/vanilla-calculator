'use strict';

var Engine = require('famous/core/Engine');
var AppView = require('./views/AppView');
// var AppConfig = require('data/AppConfig');
require('./styles');

var mainContext = Engine.createContext();
var appView = new AppView({});

mainContext.setPerspective(1000);
mainContext.add(appView);
