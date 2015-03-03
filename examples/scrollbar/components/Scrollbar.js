/** @jsx React.DOM */

'use strict';

var React = require('react');
var ReactCanvas = require('react-canvas');

var Group = ReactCanvas.Group;

var Scrollbar = React.createClass({

  propTypes: {
    scrollbarHeight: React.PropTypes.number.isRequired,
    scrollAreaWidth: React.PropTypes.number.isRequired,
  },

  render: function () {
    return (
      <Group style={this.getStyle()} />
    );
  },

  getStyle: function () {
    var margin = 2;
    var width = 7;

    return {
      top: margin,
      left: this.props.scrollAreaWidth - (width + margin),
      width: width,
      height: this.props.scrollbarHeight - (margin * 2),
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 3,
    };
  }
});

module.exports = Scrollbar;
