angular.module('mdDateTime', [])
.directive 'timeDatePicker', ['$filter', '$sce', '$rootScope', ($filter, $sce, $rootScope) ->
	_dateFilter = $filter 'date'
	restrict: 'AE'
	replace: true
	scope:
		_cancel: '=onCancel'
		_save: '=onSave'
		_modelValue: '=ngModel'
	require: 'ngModel'
	templateUrl: 'md-date-time.tpl.html'
	link: (scope, element, attrs, ngModel) ->
		attrs.$observe 'defaultMode', (val) -> scope._mode = val ? 'date'
		attrs.$observe 'displayMode', (val) -> scope._displayMode = val
		attrs.$observe 'orientation', (val) -> scope._verticalMode = val is 'true'
		attrs.$observe 'displayTwentyfour', (val) -> scope._hours24 = val? and val
		attrs.$observe 'mindate', (val) ->
			if val? and angular.isDate val then scope.restrictions.mindate = val
		attrs.$observe 'maxdate', (val) ->
			if val? and angular.isDate val then scope.restrictions.maxdate = val
		ngModel.$render = -> scope.setDate ngModel.$modelValue
		scope.save = ->
			scope._modelValue = scope.date
			ngModel.$setDirty()
			scope._save? scope.date
		scope.cancel = ->
			scope._cancel?()
			ngModel.$render()
	controller: ['$scope', (scope) ->
		scope.restrictions =
			mindate: undefined
			maxdate: undefined
		scope.setDate = (newVal) ->
			scope.date = if newVal? then new Date newVal else new Date()
			scope.calendar._year = scope.date.getFullYear()
			scope.calendar._month = scope.date.getMonth()
			scope.clock._minutes = scope.date.getMinutes()
			scope.clock._hours = if scope._hours24 then scope.date.getHours() else scope.date.getHours() % 12
		scope.display =
			fullTitle: -> _dateFilter scope.date, 'EEEE d MMMM yyyy, h:mm a'
			title: ->
				if scope._mode is 'date'
					_dateFilter scope.date, (if scope._displayMode is 'date' then 'EEEE' else 'EEEE h:mm a')
				else _dateFilter scope.date, 'MMMM d yyyy'
			super: ->
				if scope._mode is 'date' then _dateFilter scope.date, 'MMM'
				else ''
			main: -> $sce.trustAsHtml(
				if scope._mode is 'date' then _dateFilter scope.date, 'd'
				else "#{_dateFilter scope.date, 'h:mm'}<small>#{_dateFilter scope.date, 'a'}</small>"
			)
			sub: ->
				if scope._mode is 'date' then _dateFilter scope.date, 'yyyy'
				else _dateFilter scope.date, 'HH:mm'
		scope.calendar =
			_month: 0
			_year: 0
			_months: (_dateFilter new Date(0, i), 'MMMM' for i in [0..11])
			offsetMargin: -> "#{new Date(@_year, @_month).getDay() * 2.7}rem"
			isVisible: (d) -> new Date(@_year, @_month, d).getMonth() is @_month
			class: (d) ->
				# coffeelint: disable=max_line_length
				if scope.date? and new Date(@_year, @_month, d).getTime() is new Date(scope.date.getTime()).setHours(0,0,0,0) then "selected"
				else if new Date(@_year, @_month, d).getTime() is new Date().setHours(0,0,0,0) then "today"
				else ""
				# coffeelint: enable=max_line_length
			select: (d) -> scope.date.setFullYear @_year, @_month, d
			monthChange: ->
				if not @_year? or isNaN @_year then @_year = new Date().getFullYear()
				scope.date.setFullYear @_year, @_month
				if scope.date.getMonth() isnt @_month then scope.date.setDate 0
			_incMonth: (months) ->
				@_month += months
				while @_month < 0 or @_month > 11
					if @_month < 0
						@_month += 12
						@_year--
					else
						@_month -= 12
						@_year++
				@monthChange()
		scope.clock =
			_minutes: 0
			_hours: 0
			_incHours: (inc) ->
				@_hours = if scope._hours24
				then Math.max 0, Math.min 23, @_hours + inc
				else Math.max 1, Math.min 12, @_hours + inc
			_incMinutes: (inc) -> @_minutes = Math.max 0, Math.min 59, @_minutes + inc
			setAM: (b=not @isAM()) ->
				if b and not @isAM()
					scope.date.setHours(scope.date.getHours() - 12)
				else if not b and @isAM()
					scope.date.setHours(scope.date.getHours() + 12)
			isAM: -> scope.date.getHours() < 12
		scope.$watch 'clock._minutes', (val) ->
			if val? and val isnt scope.date.getMinutes() then scope.date.setMinutes val
		scope.$watch 'clock._hours', (val) ->
			if val?
				if not scope._hours24
					if val is 24 then val = 12
					else if val is 12 then val = 0
					else if not scope.clock.isAM() then val += 12
				if val isnt scope.date.getHours() then scope.date.setHours val
		scope.setNow = -> scope.setDate()
		scope._mode = 'date'
		scope.modeClass = ->
			if scope._displayMode? then scope._mode = scope._displayMode
			"#{if scope._verticalMode? and scope._verticalMode then 'vertical ' else ''}#{
			if scope._displayMode is 'full' then 'full-mode'
			else if scope._displayMode is 'time' then 'time-only'
			else if scope._displayMode is 'date' then 'date-only'
			else if scope._mode is 'date' then 'date-mode'
			else 'time-mode'}"
		scope.modeSwitch = -> scope._mode = scope._displayMode ? if scope._mode is 'date' then 'time' else 'date'
		scope.modeSwitchText = -> if scope._mode is 'date' then 'Clock' else 'Calendar'
]]