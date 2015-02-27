'use strict'
const React = require('react')
import {ReactInfinite} from '../react-infinite.jsx'
import {PlaygroundInfinity} from '../react-infinity.jsx'
import {IScrollInfinite} from '../iscroll.jsx'
import {db} from '../lib/db.jsx'

db.changes({
  live: true
})
.on('paused', () => {
  console.log('paused')
  update()
})
.on('complete', () => {
  console.log('complete')
  update()
})
.on('error', (e) => {
  console.log('error', e)
})

update()

function update() {
  db
  .allDocs({include_docs: true, descending: true})
  .then((res) => {
    let items = preformat(res.rows)
    render(items)
  })
}

function render(items) {
  React.render(
    <IScrollInfinite items={items} />,
    document.body
  )
}

function preformat(rows) {
  return rows
}
