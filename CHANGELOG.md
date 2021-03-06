# Ember-rl-week-picker Change Log

## 0.3.0

Upgrades templates syntax to the new HTML-bars syntax, which means as of this version Ember 1.12 or higher is required.

## 0.2.0

Added setting for the header string above the week-number column.

## 0.1.0

Added `minWeek` and `maxWeek` options for constraining the weeks that can be selected by the user.
Some css changes may be required if you want to use this functionality. Weeks, months and years that are not within the
valid range get an `out-of-range` class added. You may want to rerun the css generators:

```bash
ember generate rl-picker-css
ember generate rl-week-picker-css
```

You are now also allowed to bind a week string (`{year}-W{monthNumber}`, e.g. "2015-W36" for 2015, week 36) to the
`week` property, instead of binding to `year` and `weekNumber` separately.
