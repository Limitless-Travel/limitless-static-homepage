# Working with the page components

You only need this guide if your improvement changes an existing repeated component or adds a new one. For ordinary layout, content, or styling changes, you can work directly in `index.html` and the relevant stylesheet.

## How the page is organised

The page uses native light-DOM Web Components. Everything runs directly from `index.html`, without dependencies, a server, or a build step.

| What you want to change | Where to look |
|---|---|
| One-off page structure or copy | `index.html` |
| Reusable component markup | `<template>` elements near the end of `index.html` |
| Repeated component content | The matching file in `data/` |
| Data binding or component behaviour | `components.js` |
| Shared page styling | `styles/base.css`, `styles/components.css`, or `styles/responsive.css` |
| Component-specific styling | The matching file in `styles/components/` |

For example, a holiday row appears in the page as:

```html
<holiday-row data-row="uk-favourites"></holiday-row>
```

Its markup is in `#holiday-row-template`, its content is in `data/holiday-rows.js`, its rendering logic is in `components.js`, and its styles are in `styles/components/holiday-row.css`.

## Editing an existing component

- Change its HTML structure in the matching `<template>` in `index.html`.
- Change repeated text, images, or records in the matching `data/*.js` file.
- Change its styling in `styles/components/<component-name>.css`.
- Change `components.js` only when the component needs different data binding, collection rendering, or interaction behaviour.

The data files attach their records to `window.LimitlessData`. They use JavaScript rather than fetched JSON because browsers block local `fetch()` requests when the page is opened from a `file://` URL.

## Component conventions

Please preserve these conventions so the page remains easy to review:

- Keep component markup in HTML `<template>` elements, not JavaScript strings.
- Use light DOM; do not add Shadow DOM or `attachShadow()`.
- Give every custom element a hyphenated name, such as `holiday-card`.
- Name its template `<component-name>-template`.
- Use `data-field` for one value and `data-list` for a collection target.
- Bind plain content with `textContent`, not `innerHTML`.
- Keep component-specific CSS in `styles/components/<component-name>.css`.
- Scope styles to the custom element or its component classes.
- Make rendering safe to run again without duplicating content.
- Add JavaScript only when it is needed for rendering or interaction.

## Rendering repeated items

HTML templates define the markup, while the parent component loops through its data and creates each child component:

```js
class HolidayRow extends HTMLElement {
  connectedCallback() {
    const row = window.LimitlessData.holidayRows[this.dataset.row]
    const view = cloneTemplate("holiday-row-template")
    const track = view.querySelector('[data-list="cards"]')

    row.holidays.forEach(holiday => {
      const card = document.createElement("holiday-card")
      card.data = holiday
      track.append(card)
    })

    this.replaceChildren(view)
  }
}
```

Creating a registered custom element in JavaScript is expected. Its HTML structure should remain in its template in `index.html`.

## Adding a new component

1. Add the custom element where it belongs in `index.html`.
2. Add its HTML `<template>` near the end of `index.html`.
3. Add and link `styles/components/<component-name>.css`.
4. Put repeated content in the appropriate `data/*.js` file.
5. Add the rendering class to `components.js`.
6. Register child components before any parent components that create them.

Load data files before `components.js` and keep them as classic deferred scripts so the page continues to work when `index.html` is opened directly.

Before finishing, reopen `index.html`, check the affected component at desktop and mobile sizes, and confirm that the browser console contains no errors.
