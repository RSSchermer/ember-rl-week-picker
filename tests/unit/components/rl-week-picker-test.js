import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import moment from 'moment';

var App;

moduleForComponent('rl-week-picker', 'RlWeekPickerComponent', {
  needs: ['component:rl-month-picker'],

  setup: function () {
    App = startApp();
  },

  teardown: function () {
    Ember.run(App, 'destroy');
  }
});

test('does not show a picker when not in flatMode and not expanded', function (assert) {
  assert.equal(this.$().find('.picker').length, 0);
});

test('does show a picker when not in flatMode and expanded', function (assert) {
  this.$().find('.picker-toggle-btn').click();

  assert.equal(this.$().find('.picker').length, 1);
});

test('does show a picker when in flatMode', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.set('flatMode', true);
  });

  assert.equal(this.$().find('.picker').length, 1);
});

test('closes the picker when the toggle button is clicked', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.set('dropdownExpanded', true);
  });

  assert.equal(this.$().find('.picker').length, 1);

  this.$().find('.picker-toggle-btn').click();

  assert.equal(this.$().find('.picker').length, 0);
});

test('closes the picker when clicking outside', function (assert) {
  var component = this.subject();
  var $component = this.$();

  Ember.run(function () {
    component.set('dropdownExpanded', true);
  });

  assert.equal($component.find('.picker').length, 1);

  $component.parent().append('<div id="clickout-test-element"></div>');

  Ember.run.later(function () {
    $component.parent().find('#clickout-test-element').click();

    Ember.run.later(function () {
      assert.equal($component.find('.picker').length, 0);
    }, 2);
  }, 2);
});

test('decrease week button decreases the weekNumber by 1', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 5 });
  });

  this.$().find('.decrease-btn').click();

  assert.equal(component.get('year'), 2000);
  assert.equal(component.get('weekNumber'), 4);
});

test('when the weekNumber is one, decreases year by one and sets weekNumber to the number of week in that year', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 1 });
  });

  this.$().find('.decrease-btn').click();

  assert.equal(component.get('year'), 1999);
  assert.equal(component.get('weekNumber'), moment().year(1999).isoWeeksInYear());
});

test('increase week button increases the weekNumber by 1', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 5 });
  });

  this.$().find('.increase-btn').click();

  assert.equal(component.get('year'), 2000);
  assert.equal(component.get('weekNumber'), 6);
});

test('when the weekNumber is equals the number of weeks in that year, increases year by one and sets weekNumber to 1', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': moment().year(2000).isoWeeksInYear() });
  });

  this.$().find('.increase-btn').click();

  assert.equal(component.get('year'), 2001);
  assert.equal(component.get('weekNumber'), 1);
});

test('the current week is shown as the active week', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 1, 'flatMode': true });
  });

  assert.equal(this.$().find('tr.active td:first-of-type').text().trim(), '1');
});

test('the current week is not shown as the active week when the displayed year does not match the year', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 1, 'flatMode': true });
    component.setProperties({ 'displayedYear': 1999 });
  });

  assert.equal(this.$().find('tr.active').length, 0);
});

test('shows a month picker when no year has been picked', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.set('flatMode', true);
  });

  assert.equal(this.$().find('.rl-month-picker').length, 1);
});

test('decreases the displayed month when clicking the previous page button', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 5, 'flatMode': true });
    component.set('displayedMonthNumber', 2);
  });

  this.$().find('.previous-page-btn').click();

  assert.equal(component.get('displayedMonthNumber'), 1);
});

test('when the displayedMonthNumber is 1, decreases the displayedYear and sets displayedMonthNumber to 12', function (assert) {
  var component = this.subject();
  var $component = this.$();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 5, 'flatMode': true });
    component.set('displayedMonthNumber', 1);
  });

  Ember.run(function () {
    $component.find('.previous-page-btn').click();
  });

  assert.equal(component.get('displayedYear'), 1999);
  assert.equal(component.get('displayedMonthNumber'), 12);
});

test('increases the displayed month when clicking the next page button', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 5, 'flatMode': true });
    component.set('displayedMonthNumber', 2);
  });

  this.$().find('.next-page-btn').click();

  assert.equal(component.get('displayedMonthNumber'), 3);
});

test('when the displayedMonthNumber is 12, increases the displayedYear and sets displayedMonthNumber to 1', function (assert) {
  var component = this.subject();
  var $component = this.$();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 5, 'flatMode': true });
    component.set('displayedMonthNumber', 12);
  });

  Ember.run(function () {
    $component.find('.next-page-btn').click();
  });

  assert.equal(component.get('displayedYear'), 2001);
  assert.equal(component.get('displayedMonthNumber'), 1);
});

test('a week can not be selected when it is smaller than the minWeek specified', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 3, 'flatMode': true, 'minWeek': "2000-W3" });
  });

  this.$().find('td.week-column:contains("1")').click();

  assert.equal(component.get('year'), 2000);
  assert.equal(component.get('weekNumber'), 3);
});

test('the decrease week button is disabled when the current week <= the minWeek specified', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 1998, 'weekNumber': 2, 'minWeek': "1998-W2" });
  });

  this.$().find('.decrease-btn').click();

  assert.equal(component.get('year'), 1998);
  assert.equal(component.get('weekNumber'), 2);
});

test('the previous page button is disabled when the last week on the previous page < the minWeek specified', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 2, 'flatMode': true, 'minWeek': '2000-W2' });
  });

  this.$().find('.previous-page-btn').click();

  assert.equal(this.$().find('.month-picker-toggle-btn').text().trim(), 'Jan 2000');
});

test('a week can not be selected when it is greater than the maxWeek specified', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 2, 'flatMode': true, 'maxWeek': "2000-W2" });
  });

  this.$().find('td.week-column:contains("3")').click();

  assert.equal(component.get('year'), 2000);
  assert.equal(component.get('weekNumber'), 2);
});

test('the increase week button is disabled when the current week >= the maxWeek specified', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 1998, 'weekNumber': 2, 'maxWeek': "1998-W2" });
  });

  this.$().find('.increase-btn').click();

  assert.equal(component.get('year'), 1998);
  assert.equal(component.get('weekNumber'), 2);
});

test('the next page button is disabled when the first week on the next page > the minWeek specified', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'weekNumber': 51, 'flatMode': true, 'maxWeek': '2000-W52' });
  });

  this.$().find('.next-page-btn').click();

  assert.equal(this.$().find('.month-picker-toggle-btn').text().trim(), 'Dec 2000');
});
