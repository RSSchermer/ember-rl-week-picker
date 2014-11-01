import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import moment from 'moment';

var App;

moduleForComponent('rl-week-picker', 'RlWeekPickerComponent', {
  needs: ['component:rl-month-picker'],

  setup: function() {
    App = startApp();
  },

  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('does not show a picker when not in flatMode and not expanded', function () {
  var $component = this.append();

  equal($component.find('.picker').length, 0);
});

test('does show a picker when not in flatMode and expanded', function () {
  var $component = this.append();

  click('.picker-toggle-btn');

  andThen(function () {
    equal($component.find('.picker').length, 1);
  });
});

test('does show a picker when in flatMode', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.set('flatMode', true);
  });

  equal($component.find('.picker').length, 1);
});

test('closes the picker when the toggle button is clicked', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.set('dropdownExpanded', true);
  });

  equal($component.find('.picker').length, 1);

  click('.picker-toggle-btn');

  andThen(function () {
    equal($component.find('.picker').length, 0);
  });
});

test('closes the picker when clicking outside', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.set('dropdownExpanded', true);
  });

  equal($component.find('.picker').length, 1);

  Ember.$($component).parent().append('<div id="clickout-test-element"></div>');

  click('#clickout-test-element');

  andThen(function () {
    equal($component.find('.picker').length, 0);
  });
});

test('decrease week button decreases the weekNumber by 1', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 5 });
  });

  click('.decrease-btn');

  andThen(function () {
    equal(component.get('year'), 2000);
    equal(component.get('weekNumber'), 4);
  });
});

test('when the weekNumber is one, decreases year by one and sets weekNumber to the number of week in that year',
function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 1 });
  });

  click('.decrease-btn');

  andThen(function () {
    equal(component.get('year'), 1999);
    equal(component.get('weekNumber'), moment().year(1999).isoWeeksInYear());
  });
});

test('increase week button increases the weekNumber by 1', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 5 });
  });

  click('.increase-btn');

  andThen(function () {
    equal(component.get('year'), 2000);
    equal(component.get('weekNumber'), 6);
  });
});

test('when the weekNumber is equals the number of weeks in that year, increases year by one and sets weekNumber to 1',
function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': moment().year(2000).isoWeeksInYear() });
  });

  click('.increase-btn');

  andThen(function () {
    equal(component.get('year'), 2001);
    equal(component.get('weekNumber'), 1);
  });
});

test('the current week is shown as the active week', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 1, 'flatMode': true });
  });

  andThen(function () {
    equal($component.find('tr.active td:first-of-type').text().trim(), '1');
  });
});

test('the current week is not shown as the active week when the displayed year does not match the year', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 1, 'flatMode': true });
    component.setProperties({ 'displayedYear': 1999, 'displayedMonth': 1 });
  });

  andThen(function () {
    equal($component.find('tr.active').length, 0);
  });
});

test('shows a month picker when no year has been picked', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.set('flatMode', true);
  });

  andThen(function () {
    equal($component.find('.rl-month-picker').length, 1);
  });
});

test('decreases the displayed month when clicking the previous page button', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 5, 'flatMode': true });
    component.set('displayedMonthNumber', 2);
  });

  click('.previous-page-btn');

  andThen(function () {
    equal(component.get('displayedMonthNumber'), 1);
  });
});

test('when the displayedMonthNumber is 1, decreases the displayedYear and sets displayedMonthNumber to 12',
function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 5, 'flatMode': true });
    component.set('displayedMonthNumber', 1);
  });

  click('.previous-page-btn');

  andThen(function () {
    equal(component.get('displayedYear'), 1999);
    equal(component.get('displayedMonthNumber'), 12);
  });
});

test('increases the displayed month when clicking the next page button', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 5, 'flatMode': true });
    component.set('displayedMonthNumber', 2);
  });

  click('.next-page-btn');

  andThen(function () {
    equal(component.get('displayedMonthNumber'), 3);
  });
});

test('when the displayedMonthNumber is 12, increases the displayedYear and sets displayedMonthNumber to 1',
function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'weekNumber': 5, 'flatMode': true });
    component.set('displayedMonthNumber', 12);
  });

  click('.next-page-btn');

  andThen(function () {
    equal(component.get('displayedYear'), 2001);
    equal(component.get('displayedMonthNumber'), 1);
  });
});
