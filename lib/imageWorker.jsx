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

    console.log(`iamgeworker: message received for image ${e.data.url}`)

    if (e.data.url !== this.props.url) { return }
    if (e.data.err) {
      return console.log(e.data.err)
    }
    this.setState(e.data)
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.url !== nextProps.url) {
      return true
    }
    if (this.state.bloburl !== nextState.bloburl) {
      return true
    }
    return false
  },

  componentDidMount() {

    if (this.props.url) {
      this.worker = worker

      console.log('imageworker: did mount - register message event listener')

      this.worker.addEventListener('message', this.updateBlob, false)
      this.postMessage()
    }
  },

  componentWillUpdate(nextProps) {
    if (nextProps.url && nextProps.url !== this.props.url) {
      this.postMessage()
    }
  },

  componentWillUnmount() {

    console.log('imageworker: will unmount - deregister message event listener')

    this.worker.removeEventListener('message', this.updateBlob, false)
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
