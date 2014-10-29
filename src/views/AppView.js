var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
var Lightbox = require('famous/views/Lightbox');
var GridLayout = require('famous/views/GridLayout');
var CubicView = require('./CubicView');

var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var ImageSurface = require('famous/surfaces/ImageSurface');

function AppView() {
    View.apply(this, arguments);

    // your app here
    // var logo = new ImageSurface({
    //   size: [200, 200],
    //   content: 'images/famous_logo.png',
    //   classes: ['backfaceVisibility']
    // });

    // this.add(logo);

    this._sceneModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        // opacity : 0.8,
        // transform: Transform.rotate(0.1, 0.1, 0.1)
    });

    
    window.appview = this;
    this._rootNode = this.add(this._sceneModifier)
    
    // var cube = new CubicView({});
    // this._rootNode.add(cube);

    this._layout;
    _createLayout.call(this);
    
    // this.buttonBar.on('stateChange', function(index) {
    //     this.headerLightbox.show(this.headers[index]);
    //     this.contentLightbox.show(this.content[index]);
    // }.bind(this));

    // this.buttonBar.selectState(0);
}

AppView.prototype = Object.create(View.prototype);
AppView.prototype.constructor = AppView;

AppView.DEFAULT_OPTIONS = {
    dimensions : [10, 10]
    // footerSize: undefined,
    // sections: undefined,
    // transitions: undefined
};

function _createLayout() {
    this._cubes = [];
    this._layout = new GridLayout({
        dimensions: this.options.dimensions
    });
    this._layout.sequenceFrom(this._cubes);

    this._rootNode.add(this._layout);
    
    var grids = this.options.dimensions[0] * this.options.dimensions[1];
    
    for(var i = 0; i<grids; i++) {
        this._cubes.push(new CubicView({}));
    }
}

function _createHeaders() {
    var background = new Surface({
        properties: {
            backgroundColor: '#3be'
        }
    });

    this._layout.header.add(background);

    for (var i = 0; i < this.options.sections.length; i++) {
        var title = new Surface({
            content: this.options.sections[i].title,
            properties: {
                color: 'white',
                fontSize: '20px',
                textAlign: 'center',
                lineHeight: this.options.headerSize + 'px'
            }
        });

        this.headers.push(title);
    }
}

function _createContent() {
    for (var i = 0; i < 3; i++) {
        var surface = new Surface({
            content: i + '',
            properties: {
                backgroundColor: 'hsl(' + (i * 360 / 3) + ', 100%, 50%)'
            }
        });

        this.content.push(surface);
    }

    this.content[0] = new FeedView({
        tweetData: TweetData
    });

    this.content[1] = new ProfileView();
}

function _createButtonBar() {
    this.buttonBar = new ButtonBar({
        sections: this.options.sections
    });

    this._layout.footer.add(this.buttonBar);
}

module.exports = AppView;
