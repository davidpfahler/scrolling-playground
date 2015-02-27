'use strict'
import React from 'react'

let worker = new Worker('worker.js')

const imageWorker = {
  postMessage() {
    this.worker.postMessage({
      url: this.props.url
    })
  },
  updateBlob(e) {
    if (e.data.url !== this.props.url) { return }
    if (e.data.err) {
      return console.log(e.data.err)
    }
    this.setState(e.data)
  },
  componentDidMount() {
    if (this.props.url) {
      this.worker = worker
      this.worker.addEventListener('message', this.updateBlob, false)
      this.postMessage()
    }
  },
  componentDidUpdate(nextProps) {
    if (nextProps.url && nextProps.url !== this.props.url) {
      this.postMessage()
    }
  },
  componentWillUnmount() {
    this.worker.removeEventListener('message', this.updateBlob)
  },
  propTypes: {
    loadingImageBlobUrl: React.PropTypes.string,
    url: React.PropTypes.string
  },
  getInitialState() {
    return { bloburl: false }
  },
  render() {
    if (this.state.bloburl) {
      return <img src={this.state.bloburl} />
    }
    return <img src={this.props.loadingImageBlob} />
  }
}

export default React.createClass(imageWorker)
