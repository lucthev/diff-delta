'use strict'

module.exports = convertDiff

/**
 * convertDiff(diff) takes a `generic-diff` diff and turns it into an
 * an add/update/remove delta.
 *
 * @param {Array} diff
 * @return {Array}
 */
function convertDiff (diff) {
  var converted = []
  var index = 0

  for (var i = 0; i < diff.length; i += 1) {
    var change = diff[i]

    if (!change.added && !change.removed) {
      index += change.items.length
      continue
    }

    var next = diff[i + 1]
    if (next && change.removed && next.added) {
      var changeLen = change.items.length
      var nextLen = next.items.length
      var len = Math.min(changeLen, nextLen)
      converted.push({
        items: next.items.slice(0, len),
        index: index,
        added: true,
        removed: true
      })

      index += len

      if (changeLen < nextLen) {
        converted.push({
          items: next.items.slice(len),
          index: index,
          added: true,
          removed: false
        })
        index += nextLen - len
      } else if (nextLen < changeLen) {
        converted.push({
          items: change.items.slice(len),
          index: index,
          added: false,
          removed: true
        })
      }

      i += 1
      continue
    }

    converted.push({
      items: change.items.slice(),
      index: index,
      added: change.added,
      removed: change.removed
    })

    if (change.added) {
      index += change.items.length
    }
  }

  return converted
}
