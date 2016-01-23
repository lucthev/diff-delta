# diff-delta

Converts a [generic-diff][] diff into a series of add/update/remove deltas.

## Installation

```
$ npm install --save diff-delta
```

## Example

```js
var diff = require('generic-diff')
var delta = require('diff-delta')

var d = delta(diff('falafel dreams', 'fallacy means'))
console.log(d)
```

The above code logs the following:

```json
[
  {
    "items": ["a", "f", "e"],
    "index": 3,
    "added": false,
    "removed": true
  },
  {
    "items": ["a", "c", "y"],
    "index": 4,
    "added": true,
    "removed": false
  },
  {
    "items": ["m"],
    "index": 8,
    "added": true,
    "removed": true
  },
  {
    "items": ["r"],
    "index": 9,
    "added": false,
    "removed": true
  },
  {
    "items": ["n"],
    "index": 11,
    "added": true,
    "removed": true
  }
]
```

Each item in the array represents a delta, with an index at which to apply the delta _assuming all previous deltas have been applied_. The above sequences of deltas can thus be interpreted as:

1. Start with the original string, `falafel dreams`
2. Remove 3 items, `afe`, starting at index 3: `fall dreams`
3. Add `acy` at index 4: `fallacy dreams`
4. Replace 1 item at index 8 with `m`: `fallacy mreams`
5. Remove 1 item, `m`, at index 9: `fallacy meams`
6. Replace 1 item at index 11 with `n`: `fallacy means`

## License

MIT.

[generic-diff]: https://github.com/lucthev/generic-diff
