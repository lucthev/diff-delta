var test = require('tape')
var diff = require('generic-diff')
var delta = require('./')

function stringDelta (delta) {
  return delta.map(function (item) {
    var prefix = ''
    if (item.added && item.removed) {
      prefix = '~'
    } else if (item.added) {
      prefix = '+'
    } else if (item.removed) {
      prefix = '-'
    } else {
      console.log(require('util').inspect(delta))
      throw Error('Invalid delta')
    }

    return prefix + item.index + item.items.join('')
  }).join('')
}

function d (a, b) {
  return stringDelta(delta(diff(a, b)))
}

test('No changes', function (t) {
  t.plan(3)

  t.equal(d('', ''), '')
  t.equal(d('a', 'a'), '')
  t.equal(d('abcde', 'abcde'), '')
})

test('Simple additions', function (t) {
  t.plan(5)

  t.equal(d('', 'a'), '+0a')
  t.equal(d('a', 'ab'), '+1b')
  t.equal(d('b', 'ab'), '+0a')
  t.equal(d('aa', 'aba'), '+1b')
  t.equal(d('b', 'aba'), '+0a+2a')
})

test('Simple deletions', function (t) {
  t.plan(5)

  t.equal(d('a', ''), '-0a')
  t.equal(d('ab', 'a'), '-1b')
  t.equal(d('ab', 'b'), '-0a')
  t.equal(d('aba', 'aa'), '-1b')
  t.equal(d('aba', 'b'), '-0a-1a')
})

test('Simple replacements', function (t) {
  t.plan(3)

  t.equal(d('abc', 'adc'), '~1d')
  t.equal(d('abc', 'def'), '~0def')
  t.equal(d('abcba', 'adefa'), '~1def')
})

test('Replacements + additions', function (t) {
  t.plan(3)

  t.equal(d('abc', 'adef'), '~1de+3f')
  t.equal(d('abc', 'defc'), '~0de+2f')
  t.equal(d('abcba', 'adefeda'), '~1def+4ed')
})

test('Replacements + deletions', function (t) {
  t.plan(3)

  t.equal(d('abc', 'ad'), '~1d-2c')
  t.equal(d('abc', 'dc'), '~0d-1b')
  t.equal(d('abcba', 'ada'), '~1d-2cb')
})
