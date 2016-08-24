/*
 * MIT License
 *
 * Copyright (c) 2016 Kyle E. Mitchell
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = ArrayToStream

var Readable = require('readable-stream').Readable
var inherits = require('util').inherits

function ArrayToStream (array) {
  if (!(this instanceof ArrayToStream)) {
    return new ArrayToStream(array)
  } else {
    // Check for null in the array of objects.
    var hasNull = array.some(function (element) {
      return element === null
    })
    if (hasNull) {
      throw new Error('Object streams cannot emit `null`')
    }
    // Create a shallow copy of the array with `null` at the end.
    // This way:
    // 1. `_read`'s calls to `.unshift()` don't mutate the argument.
    // 2. `_read` will push `null`, the no-more-data value to end.
    this._array = array.concat(null)
    Readable.call(this, {objectMode: true})
  }
}

inherits(ArrayToStream, Readable)

ArrayToStream.prototype._read = function () {
  var array = this._array
  while (array.length !== 0) {
    if (!this.push(array.shift())) {
      break
    }
  }
}
