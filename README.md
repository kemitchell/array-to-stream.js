```javascript
var ArrayToStream = require('array-to-stream')
var assert = require('assert')

var array = [1, false, {x: '10'}]

var emitted = []
var ended = false

new ArrayToStream(array)
  .on('data', function (object) {
    emitted.push(object)
  })
  .on('end', function () {
    assert.deepEqual(emitted, array)
    ended = true
  })

process.on('exit', function () {
  assert.equal(ended, true)
})

assert.throws(function () {
  new ArrayToStream(['x', null, 'y'])
}, /Object streams cannot emit `null`/)
```
