# Ember-rl-week-picker

Ember week picker component using moment.js.

[![Build Status](https://travis-ci.org/RSSchermer/ember-rl-week-picker.svg?branch=master)](https://travis-ci.org/RSSchermer/ember-rl-week-picker)

See also:

* [ember-rl-year-picker](https://github.com/RSSchermer/ember-rl-year-picker)
* [ember-rl-month-picker](https://github.com/RSSchermer/ember-rl-month-picker)

## Demo

Demo avialable [here](http://rsschermer.github.io/ember-rl-week-picker/).

## Installation

```bash
npm install ember-rl-week-picker --save-dev
ember generate ember-moment
```

This addon does not automatically import a stylesheet into your application. Run the following command to generate a
stylesheet you can use as a base:

```bash
ember generate rl-picker-css
ember generate rl-week-picker-css
```

This will create 2 css files: one containing the base css for rl-picker at `app/styles/rl-picker/_rl-picker.css`, and
one containing some css specific for the week picker at `app/styles/rl-picker/_rl-week-picker.css`. You can include
these stylesheets into your application's sass or less files (you may have to change the file extensions them to
`.scss` or `.less`).

## Usage

```handlebars
{{rl-week-picker year=currentYear weekNumber=currentWeek}}

<!-- You can also use a week string instead of a year and week number -->
{{rl-month-picker month="2015-W36"}}
```

Bind the `year` and `weekNumber` properties to properties on your controller. Ember's two-way bindings will keep the
value updated. If you don't need the year and week number separately, you can also bind a string to the `week` property,
formatted as `{year}-W{weekNumber}` (e.g. `2015-W36` for 2015, week 36).

The following properties can be set to customize the month picker:

* `weekPlaceholderText` (default: 'Week'): the text displayed on the picker toggle button when the `weekNumber` value
  is null.
* `flatMode` (default: false): when set to true, only the picker is shown (see demo).
* `monthLabels` (default: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'): the labels used for the months, separated
  by commas, or bound to an Ember property containing an array or strings.
* `dayLabels` (default: 'Mo,Tu,We,Th,Fr,Sa,Su'): the labels used for the days, separated by commas, or bound to an
  Ember property containing an array or strings.
* `yearsPerPage` (default: 12): the number of years shown on a page.
* `minWeek` (default: null): the minimum week that can be selected. Takes a string formatted as `{year}-W{weekNumber}`
  (e.g. `2015-W36` for 2015, week 36).
* `maxWeek` (default: null): the maximum week that can be selected. Takes a string formatted as `{year}-W{weekNumber}`
  (e.g. `2015-W36` for 2015, week 36).
* `decreaseButtonText` (default: '<'): the text on the decrease year button. Set for example to
  `"<i class='fa fa-chevron-left'></i>"` to work with Font Awesome.
* `increaseButtonText` (default: '>'): the text on the decrease year button. Set for example to
  `"<i class='fa fa-chevron-right'></i>"` to work with Font Awesome.
* `previousPageButtonText` (default: '<'): the text on the previous page button. Set for example to
  `"<i class='fa fa-chevron-left'></i>"` to work with Font Awesome.
* `nextPageButtonText` (default: '>'): : the text on the next page button. Set for example to
  `"<i class='fa fa-chevron-right'></i>"` to work with Font Awesome.
* `weekColumnHeader` (default: W#): the text rendered above the column that numbers the weeks.

If you want to set different defaults for all week pickers in your application, extend the component and override the
defaults with your own:

```javascript
// app/components/rl-week-picker.js
import RlWeekPickerComponent from 'ember-rl-week-picker/components/rl-week-picker';

export default RlWeekPickerComponent.extend({
  decreaseButtonText: "<i class='fa fa-chevron-left'></i>",

  increaseButtonText: "<i class='fa fa-chevron-right'></i>",

  previousPageButtonText: "<i class='fa fa-chevron-left'></i>",

  nextPageButtonText: "<i class='fa fa-chevron-right'></i>"
});
```
