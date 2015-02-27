'use strict'
import React from 'react'
import IScroll from 'iscroll/build/iscroll-infinite.js'
import {Tile} from 'react-tile'
import chunk from 'lodash/array/chunk'
import sortBy from 'lodash/collection/sortBy'
import compact from 'lodash/array/compact'
import moment from 'moment'
import ImageWorker from './lib/imageWorker.jsx'
import loadImage from './lib/loadImage'

const thing = {
  render() {
    return(
      <div>{this.props.id}</div>
    )
  }
}

const scroller = {
  getLoadingBlobUrl() {
    let that = this
    loadImage('img/bg/twitter.png', (err, bloburl) => {
      if (err) { return console.log(err) }
      that.loadingBlobUrl = bloburl
    })
  },

  componentWillMount() {
    this.getLoadingBlobUrl()
  },

  getInitialState() {
    return {
      start: 0,
      count: 10
    }
  },
  requestData(start, count) {
    this.setState({
      start: start,
      count: count
    })
    return null
  },

  componentDidMount() {
    let that = this
    that.scroller = new IScroll('.wrapper', {
      infiniteElements: '.scroller .row',
      dataset: that.requestData,
      cacheSize: 20
    })
  },

  componentWillUnmount() {
    this.scroller.destroy()
  },

  updateContent(el, data) {
    console.log('updatecontent')
  },

  getElementHeight() {
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    return width/2 + 40 + 6
  },

  getTileProps(item) {
    let that = this
    let setters = {
      'podcast': function(item, opts) {
        let image = typeof item.image === 'object' ? item.image.url : item.image
        if (typeof image === 'string') {
          opts.backgroundImage = `url(${image})`
        }
        opts.backgroundColor = '#d5d5d5'
        opts.bar = opts.created_at
        opts.barBackground = '#e1e8ed'
        return opts
      },
      'blog': function(item, opts) {
        opts.bar = opts.created_at
        opts.barBackground = '#e1e8ed'
        opts.text = item.title
        opts.backgroundColor = '#ff9900'
        opts.backgroundImage = 'url(img/bg/blog.png)'
        opts.color = 'white'
        return opts
      },
      'instagram': function(item, opts) {
        if (typeof item.images.low_resolution.url === 'string') {
          opts.backgroundImage = `url(${item.images.low_resolution.url})`
        }
        opts.backgroundColor = '#d5d5d5'
        opts.bar = opts.created_at
        opts.barBackground = '#e1e8ed'
        return opts
      },
      'twitter': function(item, opts) {
        opts.backgroundColor = '#55ACEE'
        opts.bg = <ImageWorker
          loadingBlobUrl={that.loadingBlobUrl}
          url={'img/bg/twitter.png'} />
        // opts.backgroundImage = 'url(img/bg/twitter.png)'
        opts.barBackground = '#e1e8ed'
        opts.bar = opts.created_at
        opts.text = item.text
        opts.id_str = item.id_str
        return opts
      },
      'facebook': function(item, opts) {
        if (typeof item.picture === 'string') {
          opts.backgroundImage = `url(${item.picture})`
          opts.backgroundColor = '#d5d5d5'
        } else {
          opts.color = 'white'
          opts.backgroundColor = '#3b5998'
          opts.backgroundImage = 'url(img/bg/facebook.png)'
          opts.text = item.name || item.title || item.description || item.message
        }
        opts.barBackgound = '#e1e8ed'
        opts.bar = opts.created_at
        return opts
      },
      'google': function(item, opts) {
        opts.color = 'white'
        opts.backgroundColor = '#F44336'
        opts.backgroundImage = 'url(img/bg/google.png)'
        opts.barBackground = '#e1e8ed'
        opts.bar = opts.created_at
        opts.text = item.name || item.caption || item.title
        return opts
      },
      'youtube': function(item, opts) {
        if (typeof item.thumbnails.high.url === 'string') {
          opts.backgroundImage = `url(${item.thumbnails.high.url})`
        }
        opts.backgroundColor = '#d5d5d5'
        opts.barBackground = '#000000'
        opts.barColor = 'white'
        opts.bar = opts.created_at
        return opts
      }
    }

    var created_at = item.data.created_at || item.data.created_time || item.data.pubDate || item.data.pubdate || item.data.updated_time || item.data.updated
    if (item.provider === 'instagram') {
      created_at = item.data.created_time * 1000
    }
    if (typeof created_at === 'number') {
      created_at = moment(created_at).toISOString()
    }
    var opts = {
      _id: item._id,
      created_at: created_at,
      date: moment(created_at),
      omChannel: item.provider,
      channel: item.provider
    }
    return setters[item.provider](item.data, opts)
  },

  makeTile(data, paddingProp) {
    let props = this.getTileProps(data.doc)

    let tileStyles = {
      boxSizing: 'border-box',
      paddingBottom: '6px',
      float: 'left',
      width: '50%'
    }
    tileStyles[paddingProp] = '3px'

    return (
      <div key={props._id} style={tileStyles}>
        <Tile {...props}>{props.text}</Tile>
      </div>
    )
  },

  render() {
    let that = this
    let rowStyles = {
      height: this.getElementHeight(),
      position: 'absolute',
      width: '100%',
      top: 0,
      left: 0,
      WebkitTransform: 'translateZ(0)',
      MozTransform: 'translateZ(0)',
      msTransform: 'translateZ(0)',
      OTransform: 'translateZ(0)',
      transform: 'translateZ(0)'
    }

    let scrollerStyles = {
      position: 'absolute',
      zIndex: 1,
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      width: '100%',
      WebkitTransform: 'translateZ(0)',
      MozTransform: 'translateZ(0)',
      msTransform: 'translateZ(0)',
      OTransform: 'translateZ(0)',
      transform: 'translateZ(0)',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none',
      WebkitTextSizeAdjust: 'none',
      MozTextSizeAdjust: 'none',
      msTextSizeAdjust: 'none',
      OTextSizeAdjust: 'none',
      textSizeAdjust: 'none'
    }

    let wrapperStyles = {
      position: 'absolute',
      zIndex: 1,
      top: 45,
      bottom: 48,
      left: 0,
      width: '100%',
      overflow: 'hidden'
    }

    let rows = sortBy(this.props.items, 'id')
    // for testing, only use twitter
    rows = rows.filter((row) => {
      return row.doc.provider === 'twitter'
    })

    rows = rows.slice(this.state.start, (this.state.start+this.state.count*2))
    // rows = compact(rows)
    rows = chunk(rows, 2)
    rows = rows.map(function(row, index) {
      var tiles = [that.makeTile(row[0], 'paddingRight'),]
      if (row[1]) { tiles.push(that.makeTile(row[1], 'paddingLeft')) }

      return (
        <div style={rowStyles} key={index} className="row">
          {tiles}
        </div>
      )
    })


    return (
      <div className="wrapper" style={wrapperStyles}>
        <div className="scroller" style={scrollerStyles}>
          {rows}
        </div>
      </div>
    )
  }
}

export const IScrollInfinite = React.createClass(scroller)
