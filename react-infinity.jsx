'use strict'
import React from 'react'
import Infinity from 'react-infinity'
import chunk from 'lodash/array/chunk'

const child = {
  render() {
    return (
        <div>{this.props.id}</div>
      )
  }
}
const Child = React.createClass(child)

const scroller = {
  propTypes: {
    items: React.PropTypes.array
  },

  getElementWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  },

  getElementHeight() {
    let width = this.getElementWidth()
    console.log(width/2 + 40 + 6)
    return width/2 + 40 + 6
  },

  getContainerHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  },

  render() {
    let items = this.props.items
      // ? chunk(this.props.items, 2) : []
    return (
      <Infinity
        elementWidth={this.getElementWidth()}
        elementMobileWidth={this.getElementWidth()}
        elementHeight={this.getElementHeight()}
        elementMobileHeight={this.getElementHeight()}
        margin={6}
        childComponent={Child}
        data={items} />
    )
  }
}

export const PlaygroundInfinity = React.createClass(scroller)
