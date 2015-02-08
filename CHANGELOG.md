# Ember-rl-week-picker Changelog

# 0.1.0

Added `minWeek` and `maxWeek` options for constraining the weeks that can be selected by the user.
Some css changes may be required if you want to use this functionality. Weeks, months and years that are not within the
valid range get an `out-of-range` class added. You may want to rerun the css generators:

```bash
ember generate rl-picker-css
ember generate rl-week-picker-css
```

You are now also allowed to bind a week string (`{year}-W{monthNumber}`, e.g. "2015-W36" for 2015, week 36) to the
`week` property, instead of binding to `year` and `weekNumber` separately.
