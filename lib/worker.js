'use strict'

import loadImage from './loadimage'
import NodeCache from 'node-cache'

let cache = new NodeCache()

self.addEventListener('message', (e) => {
  let data = e.data

  let cached = cache.get(data.url)

  // someone already requested this image, but it's not here yet.
  // We can safely abort, because a message is going to be sent out to
  // all subscribers once it's here.
  if (cached[data.url]._pending) {
    console.log(`${data.url} is pending`)
    return
  }

  // image is in cache
  else if (cache.[data.url].bloburl) {
    console.log(`${data.url} is in cache`)
    return self.postMessage({
      url: data.url,
      bloburl: bloburl
    })
  }

  // remaining case: nothing in cache
  console.log(`${data.url} is being requested`)
  cache.set(data.url, { _pending: true })
  loadImage(data.url, (err, bloburl) => {
    if (err) {
      cache.del(data.url)
      return self.postMessage({
        id: data.id,
        err: err
      })
    }

    let payload = {
      id: data.id,
      bloburl: bloburl
    }
    cache.set(data.url, payload)
    self.postMessage(payload)
  })
}, false)
