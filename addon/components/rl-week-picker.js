import Ember from 'ember';
import DropdownComponentMixin from 'ember-rl-dropdown/mixins/rl-dropdown-component';
import moment from 'moment';

export default Ember.Component.extend(DropdownComponentMixin, {
  classNames: ['rl-week-picker', 'rl-picker'],

  classNameBindings: ['dropdownExpanded:expanded'],

  year: null,

  weekNumber: null,

  minYear: null,

  minWeekNumber: null,

  maxYear: null,

  maxYearNumber: null,

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

  weekColumnHeader: 'W#',

  week: function(key, value) {
    // setter
    if (arguments.length > 1 && value !== null) {
      var nameParts = value.split(/\-W/i);
      this.set('year', parseInt(nameParts[0]));
      this.set('weekNumber',  parseInt(nameParts[1]));
    }

    // getter
    return this.buildWeekString(this.get('year'), this.get('weekNumber'));
  }.property('year', 'weekNumber'),

  minWeek: function(key, value) {
    // setter
    if (arguments.length > 1 && value !== null) {
      var nameParts = value.split(/\-W/i);
      this.set('minYear', parseInt(nameParts[0]));
      this.set('minWeekNumber',  parseInt(nameParts[1]));
    }

    // getter
    return this.buildWeekString(this.get('minYear'), this.get('minWeekNumber'));
  }.property('minYear', 'minWeekNumber'),

  maxWeek: function(key, value) {
    // setter
    if (arguments.length > 1 && value !== null) {
      var nameParts = value.split(/\-W/i);
      this.set('maxYear', parseInt(nameParts[0]));
      this.set('maxWeekNumber',  parseInt(nameParts[1]));
    }

    // getter
    return this.buildWeekString(this.get('maxYear'), this.get('maxWeekNumber'));
  }.property('maxYear', 'maxWeekNumber'),

  minMonth: function () {
    var minYear = this.get('minYear');
    var minWeekNumber = this.get('minWeekNumber');

    if (minYear !== null && minWeekNumber !== null) {
      var m = moment().year(minYear).isoWeek(minWeekNumber);

      return m.year() +'-'+ (m.month() + 1);
    } else {
      return null;
    }
  }.property('minYear', 'minWeekNumber'),

  maxMonth: function () {
    var maxYear = this.get('maxYear');
    var maxWeekNumber = this.get('maxWeekNumber');

    if (maxYear !== null && maxWeekNumber !== null) {
      var m = moment().year(maxYear).isoWeek(maxWeekNumber);

      return m.year() +'-'+ (m.month() + 1);
    } else {
      return null;
    }
  }.property('maxYear', 'maxWeekNumber'),

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

  decreaseWeekButtonDisabled: function () {
    var minWeek = this.get('minWeek');

    return minWeek !== null && this.get('week') <= minWeek;
  }.property('week', 'minWeek'),

  increaseWeekButtonDisabled: function () {
    var maxWeek = this.get('maxWeek');

    return maxWeek !== null && this.get('week') <= maxWeek;
  }.property('week', 'maxWeek'),

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

  weeksOnPage: function () {
    var monthNumber = this.get('displayedMonthNumber') - 1;
    var m = moment().year(this.get('displayedYear')).month(monthNumber).date(1);
    var weeks = [];

    while(m.month() === monthNumber) {
      // Setting the day to 4 to make everything work nicely with the first
      // and last week of the year, as per the ISO standard.
      m.isoWeekday(4);

      var year = m.year();
      var weekNumber = m.isoWeek();
      var weekString = this.buildWeekString(year, weekNumber);
      var minWeek = this.get('minWeek');
      var maxWeek = this.get('maxWeek');

      var week = {
        weekNumber: weekNumber,

        year: year,

        weekString: weekString,

        isActive: weekNumber === this.get('weekNumber') && year === this.get('year'),

        outOfRange: (minWeek !== null && weekString < minWeek) || (maxWeek !== null && weekString > maxWeek),

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
  }.property('weekNumber', 'year', 'displayedMonthNumber', 'displayedYear', 'minWeek', 'maxWeek'),

  previousPageButtonDisabled: function () {
    var minWeek = this.get('minWeek');

    return minWeek !== null && this.get('weeksOnPage.firstObject.weekString') <= minWeek;
  }.property('weeksOnPage', 'minWeek'),

  nextPageButtonDisabled: function () {
    var maxWeek = this.get('maxWeek');

    return maxWeek !== null && this.get('weeksOnPage.lastObject.weekString') >= maxWeek;
  }.property('weeksOnPage', 'maxWeek'),

  actions: {
    decreaseWeek: function () {
      if (!this.get('decreaseWeekButtonDisabled')) {
        var m = this.currentMoment().isoWeekday(4).subtract(1, 'weeks');
        var newYear = m.year();
        var newWeek = m.isoWeek();

        this.setProperties({ 'weekNumber': newWeek, 'year': newYear });
        this.sendAction('pickedWeek', newYear, newWeek);
      }
    },

    increaseWeek: function () {
      if (!this.get('increaseWeekButtonDisabled')) {
        var m = this.currentMoment().isoWeekday(4).add(1, 'weeks');
        var newYear = m.year();
        var newWeek = m.isoWeek();

        this.setProperties({ 'weekNumber': newWeek, 'year': newYear });
        this.sendAction('pickedWeek', newYear, newWeek);
      }
    },

    previousPage: function () {
      if (!this.get('previousPageButtonDisabled')) {
        var m = this.currentDisplayedMoment().subtract(1, 'months');

        this.setProperties({ 'displayedMonthNumber': m.month() + 1, 'displayedYear': m.year() });
      }
    },

    nextPage: function () {
      if (!this.get('nextPageButtonDisabled')) {
        var m = this.currentDisplayedMoment().add(1, 'months');

        this.setProperties({ 'displayedMonthNumber': m.month() + 1, 'displayedYear': m.year() });
      }
    },

    openMonthPicker: function () {
      this.set('monthPickerMode', true);
    },

    pickedMonth: function (year, monthNumber) {
      this.setProperties({ 'displayedYear': year, 'displayedMonthNumber': monthNumber, 'monthPickerMode': false });
    },

    pickedWeek: function (year, weekNumber) {
      var minWeek = this.get('minWeek');
      var maxWeek = this.get('maxWeek');
      var week = this.buildWeekString(year, weekNumber);

      if (!((minWeek !== null && week < minWeek) || (maxWeek !== null && week > maxWeek))) {
        this.setProperties({ 'year': year, 'weekNumber': weekNumber, 'dropdownExpanded': false });
        this.sendAction('pickedWeek', year, weekNumber);
      }
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
  }.observes('year', 'weekNumber').on('didInsertElement'),

  buildWeekString: function (year, weekNumber) {
    if (year === null || weekNumber === null) {
      return null;
    } else {
      return year +'-W'+ (weekNumber < 10 ? ('0'+ weekNumber.toString()) : weekNumber);
    }
  }
});
