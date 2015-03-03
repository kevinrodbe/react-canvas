/** @jsx React.DOM */

'use strict';

var React = require('react');
var ReactCanvas = require('react-canvas');
var Item = require('./components/Item');
var Scrollbar = require('./components/Scrollbar');
var articles = require('../common/data');

var Surface = ReactCanvas.Surface;
var ListView = ReactCanvas.ListView;

var App = React.createClass({

  render: function () {
    var size = this.getSize();
    return (
      <Surface top={0} left={0} width={size.width} height={size.height}>
        <ListView
          style={this.getListViewStyle()}
          numberOfItemsGetter={this.getNumberOfItems}
          itemHeightGetter={Item.getItemHeight}
          itemGetter={this.renderItem}
          scrollbarGetter={this.renderScrollbar} />
      </Surface>
    );
  },

  renderItem: function (itemIndex, scrollTop) {
    var article = articles[itemIndex % articles.length];
      return (
      <Item
        width={this.getSize().width}
        height={Item.getItemHeight()}
        imageUrl={article.imageUrl}
        title={article.title}
        itemIndex={itemIndex} />
    );
  },

  renderScrollbar: function (scrollbarTop, scrollbarHeight) {
    return (
      <Scrollbar
        scrollbarHeight={scrollbarHeight}
        scrollAreaWidth={this.getSize().width} />
    );
  },

  getSize: function () {
    return document.getElementById('main').getBoundingClientRect();
  },

  // ListView
  // ========

  getListViewStyle: function () {
    var size = this.getSize();
    return {
      top: 0,
      left: 0,
      width: size.width,
      height: size.height
    };
  },

  getNumberOfItems: function () {
    return 20;
  },

});

React.render(<App />, document.getElementById('main'));
