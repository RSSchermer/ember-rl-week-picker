import Ember from 'ember';
import DropdownComponentMixin from 'ember-rl-dropdown/mixins/rl-dropdown-component';
import moment from 'moment';

export default Ember.Component.extend(DropdownComponentMixin, {
  classNames: ['rl-week-picker', 'rl-picker'],

  classNameBindings: ['dropdownExpanded:expanded'],

  year: null,

  weekNumber: null,

  weekPlaceholderText: 'Week',

  monthLabels: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',

  dayLabels: 'Mo,Tu,We,Th,Fr,Sa,Su',

  flatMode: false,

  decreaseButtonText: '<',

  increaseButtonText: '>',

  previousPageButtonText: '<',

  nextPageButtonText: '>',

  displayedYear: null,

  displayedMonthNumber: null,

  isExpanded: false,

  clickOutEventNamespace: 'rl-week-picker',

  monthPickerMode: function () {
    return !this.get('year') || !this.get('weekNumber');
  }.property('year', 'weekNumber'),

  pickerVisible: function () {
    return this.get('flatMode') || this.get('dropdownExpanded');
  }.property('flatMode', 'dropdownExpanded'),

  monthLabelsArray: function () {
    var monthLabels = this.get('monthLabels');

    return typeof monthLabels === 'string' ? monthLabels.split(',') : monthLabels;
  }.property('monthLabels'),

  dayLabelsArray: function () {
    var dayLabels = this.get('dayLabels');

    return typeof dayLabels === 'string' ? dayLabels.split(',') : dayLabels;
  }.property('dayLabels'),

  monthText: function () {
    var monthNumber = this.get('displayedMonthNumber');
    var year = this.get('displayedYear');

    if (monthNumber && year) {
      return this.get('monthLabelsArray')[monthNumber - 1] +' '+ year;
    } else {
      return null;
    }
  }.property('displayedMonthNumber', 'monthLabelsArray', 'displayedYear'),

  weekText: function () {
    var weekNumber = this.get('weekNumber');
    var year = this.get('year');

    if (weekNumber && year) {
      return year +'-W'+ weekNumber;
    } else {
      return null;
    }
  }.property('year', 'weekNumber'),

  weeks: function () {
    var monthNumber = this.get('displayedMonthNumber') - 1;
    var m = moment().year(this.get('displayedYear')).month(monthNumber).date(1);
    var weeks = [];

    while(m.month() === monthNumber) {
      // Setting the day to 4 to make everything work nicely with the first
      // and last week of the year, as per the ISO standard.
      m.isoWeekday(4);

      var week = {
        weekNumber: m.isoWeek(),

        year: m.year(),

        isActive: m.isoWeek() === this.get('weekNumber') && m.year() === this.get('year'),

        days: []
      };

      m.isoWeekday(1);

      while (m.isoWeek() === week.weekNumber) {
        week.days.push({ date: m.date(), inDisplayedMonth: m.month() === monthNumber });
        m.add(1, 'days');
      }

      weeks.push(week);
    }

    return weeks;
  }.property('weekNumber', 'year', 'displayedMonthNumber', 'displayedYear'),

  actions: {
    decreaseWeek: function () {
      var m = this.currentMoment().subtract(1, 'weeks');
      var newYear = m.year();
      var newWeek = m.isoWeek();

      this.setProperties({ 'weekNumber': newWeek, 'year': newYear });
      this.sendAction('pickedWeek', newYear, newWeek);
    },

    increaseWeek: function () {
      var m = this.currentMoment().add(1, 'weeks');
      var newYear = m.year();
      var newWeek = m.isoWeek();

      this.setProperties({ 'weekNumber': newWeek, 'year': newYear });
      this.sendAction('pickedWeek', newYear, newWeek);
    },

    previousPage: function () {
      var m = this.currentDisplayedMoment().subtract(1, 'months');

      this.setProperties({ 'displayedMonthNumber': m.month() + 1, 'displayedYear': m.year() });
    },

    nextPage: function () {
      var m = this.currentDisplayedMoment().add(1, 'months');

      this.setProperties({ 'displayedMonthNumber': m.month() + 1, 'displayedYear': m.year() });
    },

    openMonthPicker: function () {
      this.set('monthPickerMode', true);
    },

    pickedMonth: function (year, monthNumber) {
      this.setProperties({ 'displayedYear': year, 'displayedMonthNumber': monthNumber, 'monthPickerMode': false });
    },

    pickedWeek: function (year, weekNumber) {
      this.setProperties({ 'year': year, 'weekNumber': weekNumber, 'dropdownExpanded': false });
      this.sendAction('pickedWeek', year, weekNumber);
    }
  },

  currentMoment: function () {
    var week = this.get('weekNumber') || moment().isoWeek();
    var year = this.get('year') || moment().year();

    return moment().year(year).isoWeek(week);
  },

  currentDisplayedMoment: function () {
    var month = this.get('displayedMonthNumber') ? this.get('displayedMonthNumber') - 1 : moment().month();
    var year = this.get('displayedYear') || moment().year();

    return moment().year(year).month(month);
  },

  updateDisplayedYearAndMonth: function () {
    if (this.get('year') && this.get('weekNumber')) {
      var m = this.currentMoment();

      this.setProperties({ 'displayedYear': m.year(), 'displayedMonthNumber': m.month() + 1 });
    }
  }.observes('year', 'weekNumber').on('didInsertElement')
});
