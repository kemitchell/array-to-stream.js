```javascript
var ArrayToStream = require('array-to-stream')
var assert = require('assert')

var ended = false
var seen = 0

var array = [ 1, false, { x: '10' } ]

new ArrayToStream(array)
  .on('data', function(object) {
    seen++
    assert.notEqual(array.indexOf(object), -1) })
  .on('end', function() {
    ended = true
    assert.equal(seen, array.length) })

process.on('exit', function() {
  assert.equal(ended, true) })

assert.throws(
  function() { new ArrayToStream([ 'x', null, 'y' ]) },
  /Object streams cannot emit `null`/)
```
