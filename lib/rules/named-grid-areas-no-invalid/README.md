# named-grid-areas-no-invalid

Disallow invalid named grid areas.

<!-- prettier-ignore -->
```css
a { grid-template-areas:
      "a a a"
      "b b b"; }
/**   ↑
 *  This named grid area */
```

For a named grid area to be valid, all strings must define:

- the same number of cell tokens
- at least one cell token

And all named grid areas that spans multiple grid cells must form a single filled-in rectangle.

## Options

### `true`

```json
{
  "named-grid-areas-no-invalid": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { grid-template-areas: "" }
```

<!-- prettier-ignore -->
```css
a { grid-template-areas: "a a a"
                         "b b b b"; }
```

<!-- prettier-ignore -->
```css
a { grid-template-areas: "a a a"
                         "b b a"; }
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a { grid-template-areas: "a a a"
                         "b b b"; }
```
