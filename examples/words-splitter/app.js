/** @jsx React.DOM */

var React = require('react');
var ReactCanvas = require('react-canvas');

var Surface = ReactCanvas.Surface;
var Group = ReactCanvas.Group;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var FontFace = ReactCanvas.FontFace;

var App = React.createClass({

  componentDidMount: function () {
    window.addEventListener('resize', this.handleResize, true);
  },

  render: function () {
    var size = this.getSize();
    return (
      <Surface top={0} left={0} width={size.width} height={size.height}>
        <Group style={this.getPageStyle()}>
          <Text style={this.getTitleStyle(0)}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
          <Text style={this.getTitleStyle(1)} wordsSplitter=''>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
        </Group>
      </Surface>
    );
  },

  // Styles
  // ======

  getSize: function () {
    return document.getElementById('main').getBoundingClientRect();
  },

  getPageStyle: function () {
    var size = this.getSize();
    return {
      width: size.width,
      height: size.height,
      backgroundColor: '#f7f7f7',
    };
  },

  getTitleStyle: function (index) {
    var size = this.getSize();
    return {
      top: ((14 + 28) * index) + 14, left: 14,
      fontFace: FontFace('Georgia'),
      fontSize: 22,
      lineHeight: 28,
      width: size.width - (14 * 2),
      height: 28 * 1,
      color: '#333',
      backgroundColor: 'hotpink',
    };
  },

  // Events
  // ======

  handleResize: function () {
    this.forceUpdate();
  }

});

React.render(<App />, document.getElementById('main'));
