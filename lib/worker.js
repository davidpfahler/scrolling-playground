'use strict'

import loadImage from './loadimage'
import NodeCache from 'node-cache'

let cache = new NodeCache()

console.log(`worker: adding message event listener`)

self.addEventListener('message', (e) => {

  // console.log(`worker: message requesting image ${e.data.url}`)

  let data = e.data

  let res = cache.get(data.url)

  // someone already requested this image, but it's not here yet.
  // We can safely abort, because a message is going to be sent out to
  // all subscribers once it's here.
  if (res[data.url] && res[data.url]._pending) {

    // console.log(`worker: image ${data.url} is pending`)

    return
  }

  // image is in cache
  else if (res[data.url] && res[data.url].bloburl) {

    console.log(`worker: image ${data.url} is cached; now posting...`)

    return self.postMessage({
      url: res[data.url].url,
      bloburl: res[data.url].bloburl
    })
  }

  // remaining case: nothing in cache

  // console.log(`worker: ${data.url} is being requested...`)

  cache.set(data.url, { _pending: true })
  loadImage(data.url, (err, bloburl) => {

    console.log(`worker: image ${data.url} has arrived; now posting...`)

    if (err) {
      cache.del(data.url)
      return self.postMessage({
        url: data.url,
        err: err
      })
    }

    let payload = {
      url: data.url,
      bloburl: bloburl
    }
    cache.set(data.url, payload)
    self.postMessage(payload)
  })
}, false)
