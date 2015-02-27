'use strict'

import PouchDB from 'pouchdb'
import pouchDbLoad from 'pouchdb-load'

PouchDB.plugin(pouchDbLoad)

const localDb = new PouchDB('playground', {
  auto_compaction: true,
  adapter: 'websql'
})

const id = 'com.mokamoka.AppBusinessPodcast'
const dyno = id.substring(0,30).replace(/\./g, '-').toLowerCase()
const heroku = 'https://'+ dyno + '.herokuapp.com'
const url = heroku + '/db/data'
const remoteDb = new PouchDB(url)

localDb.info().then(function(res) {
  if (res.doc_count === 0) {
    return loadDump(options)
  }
  return replicate()
})

let options = {
  limit: 6,
  descending: true,
  include_docs: true
}

function loadDump() {
  var dumpUrl = 'https://'+ dyno + '.herokuapp.com/dbdump'

  localDb.load(dumpUrl, {
    proxy: url
  })
  .then(replicate)
  .catch(function (err) {
    console.log('pouchdb-load error: ', err)
  })
}

function replicate() {
  localDb.replicate.from(remoteDb)
  .on('complete', function() {
    console.log('live replication complete')
    // TODO: HACK: This is a work around for a bug in express-pouchdb
    // where live replication fails
    setTimeout(replicate, 6e4)
  })
  .on('error', function(err) {
    console.log('live replication error', err)
  })
  .on('change', function(doc) {
    console.log('live replication change', doc)
  })
}

export {localDb as db}
