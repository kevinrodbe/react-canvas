'use strict';

var React = require('react');
var assign = require('react/lib/Object.assign');
var Scroller = require('scroller');
var Group = require('./Group');
var clamp = require('./clamp');

var ListView = React.createClass({

  propTypes: {
    style: React.PropTypes.object,
    numberOfItemsGetter: React.PropTypes.func.isRequired,
    itemHeightGetter: React.PropTypes.func.isRequired,
    itemGetter: React.PropTypes.func.isRequired,
    scrollbarGetter: React.PropTypes.func,
    snapping: React.PropTypes.bool,
    scrollingDeceleration: React.PropTypes.number,
    scrollingPenetrationAcceleration: React.PropTypes.number,
    onScroll: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      style: { left: 0, top: 0, width: 0, height: 0 },
      snapping: false,
      scrollingDeceleration: 0.95,
      scrollingPenetrationAcceleration: 0.08
    };
  },

  getInitialState: function () {
    return {
      scrollTop: 0
    };
  },

  componentDidMount: function () {
    this.createScroller();
    this.updateScrollingDimensions();
  },

  render: function () {
    var items = this.getVisibleItemIndexes().map(this.renderItem);
    var scrollbar = this.renderScrollbar();

    return (
      React.createElement(Group, {
        style: this.props.style,
        onTouchStart: this.handleTouchStart,
        onTouchMove: this.handleTouchMove,
        onTouchEnd: this.handleTouchEnd,
        onTouchCancel: this.handleTouchEnd,
        onWheel: this.handleWheel},
        [items, scrollbar]
      )
    );
  },

  renderItem: function (itemIndex) {
    var item = this.props.itemGetter(itemIndex, this.state.scrollTop);
    var itemHeight = this.props.itemHeightGetter();
    var style = {
      top: 0,
      left: 0,
      width: this.props.style.width,
      height: itemHeight,
      translateY: (itemIndex * itemHeight) - this.state.scrollTop,
      zIndex: itemIndex
    };

    return (
      React.createElement(Group, {style: style, key: itemIndex},
        item
      )
    );
  },

  renderScrollbar: function () {
    if (!this.props.hasOwnProperty('scrollbarGetter')) {
      return null;
    }

    var height = this.props.style.height;
    var scrollHeight = this.props.numberOfItemsGetter() * this.props.itemHeightGetter();

    if (height > scrollHeight) {
      return null;
    }

    var scrollbarHeightPercent = height / scrollHeight;
    var scrollbarHeight = scrollbarHeightPercent * height;

    var scrollTop = this.state.scrollTop;
    var scrollbarTopPercent = scrollTop / scrollHeight;
    var scrollbarTop = scrollbarTopPercent * height;

    if (scrollbarTop < 0) {
      scrollbarHeight += scrollbarTop;
      scrollbarTop = 0;
    }

    var maxScrollbarTop = height - scrollbarHeight;
    if (scrollbarTop > maxScrollbarTop) {
      var difference = (height - scrollbarHeight) - scrollbarTop;
      scrollbarHeight += difference;
    }

    var scrollbar = this.props.scrollbarGetter(scrollbarTop, scrollbarHeight);
    var style = {
      top: 0,
      left: 0,
      width: this.props.style.width,
      height: scrollbarHeight,
      translateY: scrollbarTop,
      zIndex: this.props.numberOfItemsGetter()
    }

    return (
      React.createElement(Group, {style: style},
        scrollbar
      )
    );
  },

  // Events
  // ======

  handleTouchStart: function (e) {
    if (this.scroller) {
      this.scroller.doTouchStart(e.touches, e.timeStamp);
    }
  },

  handleTouchMove: function (e) {
    if (this.scroller) {
      e.preventDefault();
      this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
    }
  },

  handleTouchEnd: function (e) {
    if (this.scroller) {
      this.scroller.doTouchEnd(e.timeStamp);
      if (this.props.snapping) {
        this.updateScrollingDeceleration();
      }
    }
  },

  // TODO: Support snapping
  handleWheel: function (e) {
    if (this.scroller) {
      e.preventDefault();

      var event = e.nativeEvent;
      this.scroller.scrollBy(0, -Math.round(event.wheelDeltaY / 2));
    }
  },

  handleScroll: function (left, top) {
    this.setState({ scrollTop: top });
    if (this.props.onScroll) {
      this.props.onScroll(top);
    }
  },

  // Scrolling
  // =========

  createScroller: function () {
    var options = {
      scrollingX: false,
      scrollingY: true,
      decelerationRate: this.props.scrollingDeceleration,
      penetrationAcceleration: this.props.scrollingPenetrationAcceleration,
    };
    this.scroller = new Scroller(this.handleScroll, options);
  },

  updateScrollingDimensions: function () {
    var width = this.props.style.width;
    var height = this.props.style.height;
    var scrollWidth = width;
    var scrollHeight = this.props.numberOfItemsGetter() * this.props.itemHeightGetter();
    this.scroller.setDimensions(width, height, scrollWidth, scrollHeight);
  },

  getVisibleItemIndexes: function () {
    var itemIndexes = [];
    var itemHeight = this.props.itemHeightGetter();
    var itemCount = this.props.numberOfItemsGetter();
    var scrollTop = this.state.scrollTop;
    var itemScrollTop = 0;

    for (var index=0; index < itemCount; index++) {
      itemScrollTop = (index * itemHeight) - scrollTop;

      // Item is completely off-screen bottom
      if (itemScrollTop >= this.props.style.height) {
        continue;
      }

      // Item is completely off-screen top
      if (itemScrollTop <= -this.props.style.height) {
        continue;
      }

      // Part of item is on-screen.
      itemIndexes.push(index);
    }

    return itemIndexes;
  },

  updateScrollingDeceleration: function () {
    var currVelocity = this.scroller.__decelerationVelocityY;
    var currScrollTop = this.state.scrollTop;
    var targetScrollTop = 0;
    var estimatedEndScrollTop = currScrollTop;

    while (Math.abs(currVelocity).toFixed(6) > 0) {
      estimatedEndScrollTop += currVelocity;
      currVelocity *= this.props.scrollingDeceleration;
    }

    // Find the page whose estimated end scrollTop is closest to 0.
    var closestZeroDelta = Infinity;
    var pageHeight = this.props.itemHeightGetter();
    var pageCount = this.props.numberOfItemsGetter();
    var pageScrollTop;

    for (var pageIndex=0, len=pageCount; pageIndex < len; pageIndex++) {
      pageScrollTop = (pageHeight * pageIndex) - estimatedEndScrollTop;
      if (Math.abs(pageScrollTop) < closestZeroDelta) {
        closestZeroDelta = Math.abs(pageScrollTop);
        targetScrollTop = pageHeight * pageIndex;
      }
    }

    this.scroller.__minDecelerationScrollTop = targetScrollTop;
    this.scroller.__maxDecelerationScrollTop = targetScrollTop;
  }

});

module.exports = ListView;
