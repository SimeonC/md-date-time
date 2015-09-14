/*
	@license md-date-time
	@author SimeonC
	@license 2015 MIT
	@version 0.1.0
	
	See README.md for requirements and use.
*/angular.module('mdDateTime', []).directive('timeDatePicker', [
  '$filter', '$sce', '$rootScope', '$parse', function($filter, $sce, $rootScope, $parse) {
    var _dateFilter;
    _dateFilter = $filter('date');
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        _modelValue: '=ngModel',
        _weekdays: '=?tdWeekdays'
      },
      require: 'ngModel',
      templateUrl: 'md-date-time.tpl.html',
      link: function(scope, element, attrs, ngModel) {
        var cancelFn, saveFn;
        attrs.$observe('defaultMode', function(val) {
          if (val !== 'time' && val !== 'date') {
            val = 'date';
          }
          return scope._mode = val;
        });
        attrs.$observe('displayMode', function(val) {
          if (val !== 'full' && val !== 'time' && val !== 'date') {
            val = void 0;
          }
          return scope._displayMode = val;
        });
        attrs.$observe('orientation', function(val) {
          return scope._verticalMode = val === 'true';
        });
        attrs.$observe('displayTwentyfour', function(val) {
          return scope._hours24 = (val != null) && val;
        });
        attrs.$observe('mindate', function(val) {
          if ((val != null) && Date.parse(val)) {
            scope.restrictions.mindate = new Date(val);
            return scope.restrictions.mindate.setHours(0, 0, 0, 0);
          }
        });
        attrs.$observe('maxdate', function(val) {
          if ((val != null) && Date.parse(val)) {
            scope.restrictions.maxdate = new Date(val);
            return scope.restrictions.maxdate.setHours(23, 59, 59, 999);
          }
        });
        scope._weekdays = scope._weekdays || ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        scope.$watch('_weekdays', function(value) {
          if ((value == null) || !angular.isArray(value)) {
            return scope._weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
          }
        });
        ngModel.$render = function() {
          return scope.setDate(ngModel.$modelValue);
        };
        saveFn = $parse(attrs.onSave);
        cancelFn = $parse(attrs.onCancel);
        scope.save = function() {
          scope._modelValue = scope.date;
          ngModel.$setDirty();
          return saveFn(scope.$parent, {
            $value: scope.date
          });
        };
        return scope.cancel = function() {
          cancelFn(scope.$parent, {});
          return ngModel.$render();
        };
      },
      controller: [
        '$scope', function(scope) {
          var i;
          scope.restrictions = {
            mindate: void 0,
            maxdate: void 0
          };
          scope.setDate = function(newVal) {
            scope.date = newVal ? new Date(newVal) : new Date();
            scope.calendar._year = scope.date.getFullYear();
            scope.calendar._month = scope.date.getMonth();
            scope.clock._minutes = scope.date.getMinutes();
            scope.clock._hours = scope._hours24 ? scope.date.getHours() : scope.date.getHours() % 12;
            if (!scope._hours24 && scope.clock._hours === 0) {
              return scope.clock._hours = 12;
            }
          };
          scope.display = {
            fullTitle: function() {
              return _dateFilter(scope.date, 'EEEE d MMMM yyyy, h:mm a');
            },
            title: function() {
              if (scope._mode === 'date') {
                return _dateFilter(scope.date, (scope._displayMode === 'date' ? 'EEEE' : 'EEEE h:mm a'));
              } else {
                return _dateFilter(scope.date, 'MMMM d yyyy');
              }
            },
            "super": function() {
              if (scope._mode === 'date') {
                return _dateFilter(scope.date, 'MMM');
              } else {
                return '';
              }
            },
            main: function() {
              return $sce.trustAsHtml(scope._mode === 'date' ? _dateFilter(scope.date, 'd') : (_dateFilter(scope.date, 'h:mm')) + "<small>" + (_dateFilter(scope.date, 'a')) + "</small>");
            },
            sub: function() {
              if (scope._mode === 'date') {
                return _dateFilter(scope.date, 'yyyy');
              } else {
                return _dateFilter(scope.date, 'HH:mm');
              }
            }
          };
          scope.calendar = {
            _month: 0,
            _year: 0,
            _months: [],
            _allMonths: (function() {
              var j, results;
              results = [];
              for (i = j = 0; j <= 11; i = ++j) {
                results.push(_dateFilter(new Date(0, i), 'MMMM'));
              }
              return results;
            })(),
            offsetMargin: function() {
              return (new Date(this._year, this._month).getDay() * 2.7) + "rem";
            },
            isVisible: function(d) {
              return new Date(this._year, this._month, d).getMonth() === this._month;
            },
            isDisabled: function(d) {
              var currentDate, maxdate, mindate;
              currentDate = new Date(this._year, this._month, d);
              mindate = scope.restrictions.mindate;
              maxdate = scope.restrictions.maxdate;
              return ((mindate != null) && currentDate < mindate) || ((maxdate != null) && currentDate > maxdate);
            },
            isVisibleMonthButton: function(minOrMax) {
              var date;
              date = scope.restrictions[minOrMax];
              return (date != null) && this._month <= date.getMonth() && this._year <= date.getFullYear();
            },
            "class": function(d) {
              var classString;
              classString = '';
              if ((scope.date != null) && new Date(this._year, this._month, d).getTime() === new Date(scope.date.getTime()).setHours(0, 0, 0, 0)) {
                classString += "selected";
              }
              if (new Date(this._year, this._month, d).getTime() === new Date().setHours(0, 0, 0, 0)) {
                classString += " today";
              }
              return classString;
            },
            select: function(d) {
              return scope.date.setFullYear(this._year, this._month, d);
            },
            monthChange: function() {
              var maxdate, mindate;
              if ((this._year == null) || isNaN(this._year)) {
                this._year = new Date().getFullYear();
              }
              mindate = scope.restrictions.mindate;
              maxdate = scope.restrictions.maxdate;
              if ((mindate != null) && mindate.getFullYear() === this._year && mindate.getMonth() >= this._month) {
                this._month = Math.max(mindate.getMonth(), this._month);
              }
              if ((maxdate != null) && maxdate.getFullYear() === this._year && maxdate.getMonth() <= this._month) {
                this._month = Math.min(maxdate.getMonth(), this._month);
              }
              scope.date.setFullYear(this._year, this._month);
              if (scope.date.getMonth() !== this._month) {
                scope.date.setDate(0);
              }
              if ((mindate != null) && scope.date < mindate) {
                scope.date.setDate(mindate.getTime());
                scope.calendar.select(mindate.getDate());
              }
              if ((maxdate != null) && scope.date > maxdate) {
                scope.date.setDate(maxdate.getTime());
                return scope.calendar.select(maxdate.getDate());
              }
            },
            _incMonth: function(months) {
              this._month += months;
              while (this._month < 0 || this._month > 11) {
                if (this._month < 0) {
                  this._month += 12;
                  this._year--;
                } else {
                  this._month -= 12;
                  this._year++;
                }
              }
              return this.monthChange();
            }
          };
          scope.clock = {
            _minutes: 0,
            _hours: 0,
            _incHours: function(inc) {
              this._hours = scope._hours24 ? Math.max(0, Math.min(23, this._hours + inc)) : Math.max(1, Math.min(12, this._hours + inc));
              if (isNaN(this._hours)) {
                return this._hours = 0;
              }
            },
            _incMinutes: function(inc) {
              this._minutes = Math.max(0, Math.min(59, this._minutes + inc));
              if (isNaN(this._minutes)) {
                return this._minutes = 0;
              }
            },
            setAM: function(b) {
              if (b == null) {
                b = !this.isAM();
              }
              if (b && !this.isAM()) {
                return scope.date.setHours(scope.date.getHours() - 12);
              } else if (!b && this.isAM()) {
                return scope.date.setHours(scope.date.getHours() + 12);
              }
            },
            isAM: function() {
              return scope.date.getHours() < 12;
            }
          };
          scope.$watch('clock._minutes', function(val, oldVal) {
            if ((val != null) && val !== scope.date.getMinutes() && !isNaN(val) && (0 <= val && val <= 59)) {
              return scope.date.setMinutes(val);
            }
          });
          scope.$watch('clock._hours', function(val) {
            if ((val != null) && !isNaN(val)) {
              if (!scope._hours24) {
                if (val === 24) {
                  val = 12;
                } else if (val === 12) {
                  val = 0;
                } else if (!scope.clock.isAM()) {
                  val += 12;
                }
              }
              if (val !== scope.date.getHours()) {
                return scope.date.setHours(val);
              }
            }
          });
          scope.$watch('calendar._year', function(val) {
            var len, maxdate, mindate;
            mindate = scope.restrictions.mindate;
            maxdate = scope.restrictions.maxdate;
            i = (mindate != null) && mindate.getFullYear() === scope.calendar._year ? mindate.getMonth() : 0;
            len = (maxdate != null) && maxdate.getFullYear() === scope.calendar._year ? maxdate.getMonth() : 11;
            return scope.calendar._months = scope.calendar._allMonths.slice(i, len + 1);
          });
          scope.setNow = function() {
            return scope.setDate();
          };
          scope._mode = 'date';
          scope.modeClass = function() {
            if (scope._displayMode != null) {
              scope._mode = scope._displayMode;
            }
            return "" + ((scope._verticalMode != null) && scope._verticalMode ? 'vertical ' : '') + (scope._displayMode === 'full' ? 'full-mode' : scope._displayMode === 'time' ? 'time-only' : scope._displayMode === 'date' ? 'date-only' : scope._mode === 'date' ? 'date-mode' : 'time-mode');
          };
          scope.modeSwitch = function() {
            var ref;
            return scope._mode = (ref = scope._displayMode) != null ? ref : scope._mode === 'date' ? 'time' : 'date';
          };
          return scope.modeSwitchText = function() {
            if (scope._mode === 'date') {
              return 'Clock';
            } else {
              return 'Calendar';
            }
          };
        }
      ]
    };
  }
]);

'use strict';

angular.module('mdDateTime').run(['$templateCache', function($templateCache) {

  $templateCache.put('md-date-time.tpl.html', '<div ng-class="modeClass()" class="time-date"><div ng-click="modeSwitch()" aria-label="Switch to {{modeSwitchText()}}" class="display"><div class="title">{{display.title()}}</div><div class="content"><div class="super-title">{{display.super()}}</div><div ng-bind-html="display.main()" class="main-title"></div><div class="sub-title">{{display.sub()}}</div></div></div><div class="control"><div class="full-title">{{display.fullTitle()}}</div><div class="slider"><div class="date-control"><div class="title"><md-button ng-click="calendar._incMonth(-1)" aria-label="Previous Month" style="float: left" ng-class="{\'visuallyhidden\': calendar.isVisibleMonthButton(\'mindate\')}"><i class="fa fa-caret-left"></i></md-button><span class="month-part">{{date | date:\'MMMM\'}}<select ng-model="calendar._month" ng-change="calendar.monthChange()" ng-options="calendar._allMonths.indexOf(month) as month for month in calendar._months"></select></span><input ng-model="calendar._year" ng-change="calendar.monthChange()" type="number" min="{{restrictions.mindate ? restrictions.mindate.getFullYear() : 0}}" max="{{restrcitions.maxdate ? restrictions.maxdate.getFullYear() : NaN}}" class="year-part"><md-button ng-click="calendar._incMonth(1)" aria-label="Next Month" style="float: right" ng-class="{\'visuallyhidden\': calendar.isVisibleMonthButton(\'maxdate\')}"><i class="fa fa-caret-right"></i></md-button></div><div class="headers"><div ng-repeat="day in _weekdays track by $index" class="day-cell">{{day}}</div></div><div class="days"><md-button ng-style="{\'margin-left\': calendar.offsetMargin()}" ng-class="calendar.class(1)" ng-disabled="calendar.isDisabled(1)" ng-show="calendar.isVisible(1)" ng-click="calendar.select(1)" class="day-cell">1</md-button><md-button ng-class="calendar.class(2)" ng-show="calendar.isVisible(2)" ng-disabled="calendar.isDisabled(2)" ng-click="calendar.select(2)" class="day-cell">2</md-button><md-button ng-class="calendar.class(3)" ng-show="calendar.isVisible(3)" ng-disabled="calendar.isDisabled(3)" ng-click="calendar.select(3)" class="day-cell">3</md-button><md-button ng-class="calendar.class(4)" ng-show="calendar.isVisible(4)" ng-disabled="calendar.isDisabled(4)" ng-click="calendar.select(4)" class="day-cell">4</md-button><md-button ng-class="calendar.class(5)" ng-show="calendar.isVisible(5)" ng-disabled="calendar.isDisabled(5)" ng-click="calendar.select(5)" class="day-cell">5</md-button><md-button ng-class="calendar.class(6)" ng-show="calendar.isVisible(6)" ng-disabled="calendar.isDisabled(6)" ng-click="calendar.select(6)" class="day-cell">6</md-button><md-button ng-class="calendar.class(7)" ng-show="calendar.isVisible(7)" ng-disabled="calendar.isDisabled(7)" ng-click="calendar.select(7)" class="day-cell">7</md-button><md-button ng-class="calendar.class(8)" ng-show="calendar.isVisible(8)" ng-disabled="calendar.isDisabled(8)" ng-click="calendar.select(8)" class="day-cell">8</md-button><md-button ng-class="calendar.class(9)" ng-show="calendar.isVisible(9)" ng-disabled="calendar.isDisabled(9)" ng-click="calendar.select(9)" class="day-cell">9</md-button><md-button ng-class="calendar.class(10)" ng-show="calendar.isVisible(10)" ng-disabled="calendar.isDisabled(10)" ng-click="calendar.select(10)" class="day-cell">10</md-button><md-button ng-class="calendar.class(11)" ng-show="calendar.isVisible(11)" ng-disabled="calendar.isDisabled(11)" ng-click="calendar.select(11)" class="day-cell">11</md-button><md-button ng-class="calendar.class(12)" ng-show="calendar.isVisible(12)" ng-disabled="calendar.isDisabled(12)" ng-click="calendar.select(12)" class="day-cell">12</md-button><md-button ng-class="calendar.class(13)" ng-show="calendar.isVisible(13)" ng-disabled="calendar.isDisabled(13)" ng-click="calendar.select(13)" class="day-cell">13</md-button><md-button ng-class="calendar.class(14)" ng-show="calendar.isVisible(14)" ng-disabled="calendar.isDisabled(14)" ng-click="calendar.select(14)" class="day-cell">14</md-button><md-button ng-class="calendar.class(15)" ng-show="calendar.isVisible(15)" ng-disabled="calendar.isDisabled(15)" ng-click="calendar.select(15)" class="day-cell">15</md-button><md-button ng-class="calendar.class(16)" ng-show="calendar.isVisible(16)" ng-disabled="calendar.isDisabled(16)" ng-click="calendar.select(16)" class="day-cell">16</md-button><md-button ng-class="calendar.class(17)" ng-show="calendar.isVisible(17)" ng-disabled="calendar.isDisabled(17)" ng-click="calendar.select(17)" class="day-cell">17</md-button><md-button ng-class="calendar.class(18)" ng-show="calendar.isVisible(18)" ng-disabled="calendar.isDisabled(18)" ng-click="calendar.select(18)" class="day-cell">18</md-button><md-button ng-class="calendar.class(19)" ng-show="calendar.isVisible(19)" ng-disabled="calendar.isDisabled(19)" ng-click="calendar.select(19)" class="day-cell">19</md-button><md-button ng-class="calendar.class(20)" ng-show="calendar.isVisible(20)" ng-disabled="calendar.isDisabled(20)" ng-click="calendar.select(20)" class="day-cell">20</md-button><md-button ng-class="calendar.class(21)" ng-show="calendar.isVisible(21)" ng-disabled="calendar.isDisabled(21)" ng-click="calendar.select(21)" class="day-cell">21</md-button><md-button ng-class="calendar.class(22)" ng-show="calendar.isVisible(22)" ng-disabled="calendar.isDisabled(22)" ng-click="calendar.select(22)" class="day-cell">22</md-button><md-button ng-class="calendar.class(23)" ng-show="calendar.isVisible(23)" ng-disabled="calendar.isDisabled(23)" ng-click="calendar.select(23)" class="day-cell">23</md-button><md-button ng-class="calendar.class(24)" ng-show="calendar.isVisible(24)" ng-disabled="calendar.isDisabled(24)" ng-click="calendar.select(24)" class="day-cell">24</md-button><md-button ng-class="calendar.class(25)" ng-show="calendar.isVisible(25)" ng-disabled="calendar.isDisabled(25)" ng-click="calendar.select(25)" class="day-cell">25</md-button><md-button ng-class="calendar.class(26)" ng-show="calendar.isVisible(26)" ng-disabled="calendar.isDisabled(26)" ng-click="calendar.select(26)" class="day-cell">26</md-button><md-button ng-class="calendar.class(27)" ng-show="calendar.isVisible(27)" ng-disabled="calendar.isDisabled(27)" ng-click="calendar.select(27)" class="day-cell">27</md-button><md-button ng-class="calendar.class(28)" ng-show="calendar.isVisible(28)" ng-disabled="calendar.isDisabled(28)" ng-click="calendar.select(28)" class="day-cell">28</md-button><md-button ng-class="calendar.class(29)" ng-show="calendar.isVisible(29)" ng-disabled="calendar.isDisabled(29)" ng-click="calendar.select(29)" class="day-cell">29</md-button><md-button ng-class="calendar.class(30)" ng-show="calendar.isVisible(30)" ng-disabled="calendar.isDisabled(30)" ng-click="calendar.select(30)" class="day-cell">30</md-button><md-button ng-class="calendar.class(31)" ng-show="calendar.isVisible(31)" ng-disabled="calendar.isDisabled(31)" ng-click="calendar.select(31)" class="day-cell">31</md-button></div></div><md-button ng-click="modeSwitch()" aria-label="Switch to {{modeSwitchText()}}" class="switch-control"><i class="fa fa-clock-o"></i><i class="fa fa-calendar"></i><span class="visuallyhidden">{{modeSwitchText()}}</span></md-button><div class="time-control"><div class="time-inputs"><input type="number" min="{{_hours24 ? 0 : 1}}" max="{{_hours24 ? 23 : 12}}" ng-model="clock._hours"><md-button ng-click="clock._incHours(1)" aria-label="Increment Hours" class="hours up"><i class="fa fa-caret-up"></i></md-button><md-button ng-click="clock._incHours(-1)" aria-label="Decrement Hours" class="hours down"><i class="fa fa-caret-down"></i></md-button><input type="number" min="0" max="59" ng-model="clock._minutes"><md-button ng-click="clock._incMinutes(1)" aria-label="Increment Minutes" class="minutes up"><i class="fa fa-caret-up"></i></md-button><md-button ng-click="clock._incMinutes(-1)" aria-label="Decrement Minutes" class="minutes down"><i class="fa fa-caret-down"></i></md-button></div><div ng-if="!_hours24" class="buttons"><md-button ng-click="clock.setAM()" aria-label="Switch AM/PM">{{date | date:\'a\'}}</md-button></div></div></div></div><div class="buttons"><md-button ng-click="setNow()" aria-label="Set To Current {{ _dispalyMode == \'date\' ? \'Date\' : \'Date/Time\'}}">Now</md-button><md-button ng-click="cancel()" aria-label="Cancel">Cancel</md-button><md-button ng-click="save()" aria-label="Save">Save</md-button></div></div>');

}]);