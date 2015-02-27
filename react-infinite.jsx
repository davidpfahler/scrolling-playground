'use strict'
const React = require('react')
import Infinite from 'react-infinite'
import {Tile} from 'react-tile'

const scroller = {
  getElementHeight() {
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    return width/2 + 40 + 6
  },

  getContainerHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  },

  makeRows(items) {
    let style = {
      height: this.getElementHeight()
    }

    return items.map((item, index) => {
      return (
        <div key={index} style={style}>{item.id}</div>
      )
    })
  },

  render() {
    return (
      <Infinite containerHeight={this.getContainerHeight()} elementHeight={this.getElementHeight()}>
        {this.makeRows(this.props.items)}
      </Infinite>
    )
  }
}

export const ReactInfinite = React.createClass(scroller)
