'use strict'

var loadImage = function(url, callback) {
  var xhr = new global.XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'

  xhr.onload = function() {
    if (this.status !== 200) return callback(new Error())

    var blob = new Blob([this.response], {type: 'image/jpg'})
    var url = URL.createObjectURL(blob)
    callback(null, url)
  }

  xhr.send()
}

export default loadImage
