
## vuetify3 to Quasar conversion cheatsheet

* Flex classes. Quasar tool: [Flex Playground](https://quasar.dev/layout/grid/flex-playground)
  * `d-flex` || `flex-row` -> `row`
  * `flex-column` -> `column`
  * `d-inline-flex` -> `row inline` || `column inline`
  * `flex-row-reverse` -> `row reverse`
  * `flex-column-reverse` -> `column reverse`
  * Grow
    * `flex-grow-1` -> `col-grow`
    * `flex-shrink-1` -> `col-shrink`
  * Wrapping
    * `flex-wrap` -> `wrap` (set by default!)
    * `flex-nowrap` -> `no-wrap`
    * `flex-wrap-reverse` -> `reverse-wrap`
  * Justify x-axis
    * [x] `justify-start *end *center`
    * `justify-space-between` -> `justify-between`
    * `justify-space-around` -> `justify-around`
    * `justify-space-evenly` -> `justify-evenly`
  * Sizes `col` evenly. `col-[1-12]` with breakpoint `col-[xs-sm-md-lg-xl]-[1-12]` or with offset `offset-md-4`
    * `col-*`
    * `col-auto` use only space that is required. `col` uses all space available (but will shrink if required)
    * `flex-grow-1` -> `col-grow`
    * `flex-shrink-1` -> `col-shrink`
    * flex-grow-0 and flex-shrink-0 are not availble. Also no breakpoints
  * Align y-axis
    * `align-start` -> `items-start`
    * `align-end` -> `items-end`
    * `align-center` -> `items-center`
    * `align-baseline` -> `items-baseline`
    * `align-stretch` -> `items-stretch`
* Position
  * `position-absolute`->`absolute`
  * `position-relative`->`relative-position`
* Spacing
  * `ma-2` -> `q-ma-sm` (1,2,3,4,5,6 -> xs, sm, md, lg xl (6 missing))
* Width and height
  * `w-100` && `h-100` -> `fit`
  * `w-100` -> `full-width`
  * `h-100` -> `full-height`
  * `h-screen` -> `window-height`
* Rounded borders
  * `rounded`->`rounded-borders`
* COMPONENTS
  * `v-text-field` -> `q-input`
    * `error-messages` -> `error-message` also add `bottom-slots`. HINT: Better use `rules` prop
    * `@input` -> `:rules="[fn]"` Rule returns string (indicates error) or boolean true. You can use plain js functions and add `reactive-rules` if vars of the rule changes independent of the current input element (if it depends on other inputs)
  * `v-select` -> `q-select`
    * emit-value
    * map-options
    * `item-title="Name"` -> `option-label="Name"` Default is property 'label'
    * `item-value="ItemId"` ->`option-value="ItemId"` Default is property 'value'
    * `items` -> `options`
  * `v-btn` -> `q-btn`
    * `variant="tonal"` No replacement, use `flat` which has a tonal hover effect
    * `variant="elevated"` -> Removed, button has a shadow by default. Use `unelevated` to remove shadow
    * `variant="flat"` -> `flat`
    * `variant="outlined"` _> `outline`
    * `variant="text"` -> Use `flat` and `unelevated`
    * `variant="plain"` -> No replacement
    * `rounded="XX"` -> `round`
    * `size` -> `size="XX"` 'x-small', 'small', 'large', 'x-large' ->'xs', 'sm', 'md', 'lg', 'xl' or '20px'
  * `v-menu` -> `q-menu`
    * q-menu is wrappend by q-btn (or any other). There are more options available
    * Position: [Quasar tool](https://quasar.dev/vue-components/menu#positioning)
    * `location="top"` -> `anchor="top left" self="bottom left"`
    * Layout -> `q-list` -> `q-item` -> `q-item-section`
    * Set `clickable` on `q-item` if element is clickable
    * Set `auto-close` on `q-menu` if click on an element should close the menu
  * `v-slider` -> `q-slider`
    * `direction="vertical"` -> `vertical`
  * `v-list` -> `q-list`. Docs: [Quasar list](https://quasar.dev/vue-components/list-and-list-items#basic)
    * `v-list-item` -> `q-item` If it should be clickable add also `clickable` as prop
    * `v-list-item-title` -> `q-item-label` Be aware: Use `q-item-section` inside a `q-item` instead of a `q-item-label`
  * `v-card` -> `q-card`
    * `v-card-title` -> `q-card-section` add a div with class `text-h6` as title and optional a div as subtitle with class `text-subtitle2` or `text-subtitle1`
    * `v-card-text` -> `q-card-section`
    * `v-card-actions` -> `q-card-actions`
  * `v-expansion-panels` -> `q-expansion-item`
    * [Expansion Item](https://quasar.dev/vue-components/expansion-item)
  * `v-chip` -> `q-chip`
    * `variant="outlined"` -> `outline`
    * If chip is clickable add `clickable`
  * Many components: `density="compact"` -> `dense`
