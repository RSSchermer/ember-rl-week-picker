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

  isExpanded: false,

  clickOutEventNamespace: 'rl-week-picker',

  weekColumnHeader: 'W#',

  displayedYear: null,

  displayedMonthNumber: null,

  init: function () {
    this._super.apply(this, arguments);

    this.updateDisplayedYearAndMonth();
  },

  week: Ember.computed('year', 'weekNumber', {
    get: function () {
      return this.buildWeekString(this.get('year'), this.get('weekNumber'));
    },

    set: function(key, weekString) {
      if (weekString !== null) {
        var parts = weekString.split(/\-W/i);
        var year = parseInt(parts[0]);
        var weekNumber = parseInt(parts[1]);

        this.setProperties({ 'year': year, 'weekNumber': weekNumber });

        return this.buildWeekString(year, weekNumber);
      }

      return null;
    }
  }),

  minWeek: Ember.computed('minYear', 'minWeekNumber', {
    get: function () {
      return this.buildWeekString(this.get('minYear'), this.get('minWeekNumber'));
    },

    set: function(key, weekString) {
      if (weekString !== null) {
        var parts = weekString.split(/\-W/i);
        var year = parseInt(parts[0]);
        var weekNumber = parseInt(parts[1]);

        this.setProperties({ 'minYear': year, 'minWeekNumber': weekNumber });

        return this.buildWeekString(year, weekNumber);
      }

      return null;
    }
  }),

  maxWeek: Ember.computed('maxYear', 'maxWeekNumber', {
    get: function () {
      return this.buildWeekString(this.get('maxYear'), this.get('maxWeekNumber'));
    },

    set: function(key, weekString) {
      if (weekString !== null) {
        var parts = weekString.split(/\-W/i);
        var year = parseInt(parts[0]);
        var weekNumber = parseInt(parts[1]);

        this.setProperties({ 'maxYear': year, 'maxWeekNumber': weekNumber });

        return this.buildWeekString(year, weekNumber);
      }

      return null;
    }
  }),

  minMonth: Ember.computed('minYear', 'minWeekNumber', function () {
    var minYear = this.get('minYear');
    var minWeekNumber = this.get('minWeekNumber');

    if (minYear !== null && minWeekNumber !== null) {
      var m = moment().year(minYear).isoWeek(minWeekNumber);

      return m.year() +'-'+ (m.month() + 1);
    } else {
      return null;
    }
  }),

  maxMonth: Ember.computed('maxYear', 'maxWeekNumber', function () {
    var maxYear = this.get('maxYear');
    var maxWeekNumber = this.get('maxWeekNumber');

    if (maxYear !== null && maxWeekNumber !== null) {
      var m = moment().year(maxYear).isoWeek(maxWeekNumber);

      return m.year() +'-'+ (m.month() + 1);
    } else {
      return null;
    }
  }),

  monthPickerMode: Ember.computed('year', 'weekNumber', function () {
    return !this.get('year') || !this.get('weekNumber');
  }),

  pickerVisible: Ember.computed('flatMode', 'dropdownExpanded', function () {
    return this.get('flatMode') || this.get('dropdownExpanded');
  }),

  monthLabelsArray: Ember.computed('monthLabels', function () {
    var monthLabels = this.get('monthLabels');

    return typeof monthLabels === 'string' ? Ember.A(monthLabels.split(',')) : Ember.A(monthLabels);
  }),

  dayLabelsArray: Ember.computed('dayLabels', function () {
    var dayLabels = this.get('dayLabels');

    return typeof dayLabels === 'string' ? Ember.A(dayLabels.split(',')) : Ember.A(dayLabels);
  }),

  decreaseWeekButtonDisabled: Ember.computed('week', 'minWeek', function () {
    var minWeek = this.get('minWeek');

    return minWeek !== null && this.get('week') <= minWeek;
  }),

  increaseWeekButtonDisabled: Ember.computed('week', 'maxWeek', function () {
    var maxWeek = this.get('maxWeek');

    return maxWeek !== null && this.get('week') >= maxWeek;
  }),

  monthText: Ember.computed('displayedMonthNumber', 'monthLabelsArray', 'displayedYear', function () {
    var monthNumber = this.get('displayedMonthNumber');
    var year = this.get('displayedYear');

    if (monthNumber && year) {
      return this.get('monthLabelsArray')[monthNumber - 1] +' '+ year;
    } else {
      return null;
    }
  }),

  weekText: Ember.computed('year', 'weekNumber', function () {
    var weekNumber = this.get('weekNumber');
    var year = this.get('year');

    if (weekNumber && year) {
      return year +'-W'+ weekNumber;
    } else {
      return null;
    }
  }),

  weeksOnPage: Ember.computed('weekNumber', 'year', 'displayedMonthNumber', 'displayedYear', 'minWeek', 'maxWeek', function () {
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

    return Ember.A(weeks);
  }),

  previousPageButtonDisabled: Ember.computed('weeksOnPage', 'minWeek', function () {
    var minWeek = this.get('minWeek');

    return minWeek !== null && this.get('weeksOnPage.firstObject.weekString') <= minWeek;
  }),

  nextPageButtonDisabled: Ember.computed('weeksOnPage', 'maxWeek', function () {
    var maxWeek = this.get('maxWeek');

    return maxWeek !== null && this.get('weeksOnPage.lastObject.weekString') >= maxWeek;
  }),

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


  updateDisplayedYearAndMonth: Ember.observer('year', 'weekNumber', function () {
    if (this.get('year') && this.get('weekNumber')) {
      var m = this.currentMoment();

      this.setProperties({ 'displayedYear': m.year(), 'displayedMonthNumber': m.month() + 1 });
    }
  }),

  buildWeekString: function (year, weekNumber) {
    if (year === null || weekNumber === null) {
      return null;
    } else {
      return year +'-W'+ (weekNumber < 10 ? ('0'+ weekNumber.toString()) : weekNumber);
    }
  }
});
