scDateTime (formerly mdDateTime)
===========


## Requirements

1. `AngularJS` ≥ `1.2.x`
2. `FontAwesome` ≥ `4.2.x`

### Optional Recommended requirements

1. [Angular-Material](https://github.com/angular/material)
2. [Bootstrap](http://getbootstrap.com) (Note with bootstrap <= v3 a default font-size of 16px is recommended as all sizes are set via rem)

### Where to get it

**Via Bower:**

Run `bower install sc-date-time` from the command line.
Include script tags similar to the following:
```html
<link rel='stylesheet' href='/bower_components/sc-date-time/dist/sc-date-time.css'>
<script src='/bower_components/sc-date-time/dist/sc-date-time.js'></script>
```

**Via Github**

Download the code from [https://github.com/simeonc/sc-date-time/releases/latest](https://github.com/simeonc/sc-date-time/releases/latest), unzip the files then add script tags similar to the following:
```html
<link rel='stylesheet' href='/path/to/unzipped/files/sc-date-time/dist/sc-date-time.css'>
<script src='/path/to/unzipped/files/sc-date-time/dist/sc-date-time.js'></script>
```

### Usage

1. Include `sc-date-time.js` and `sc-date-time.css`.
2. Add a dependency to `scDateTime` in your app module, for example: ```angular.module('myModule', ['scDateTime'])```.
3. Some implementation settings are required to get this useful, but for basic inline use:
```html
<time-date-picker ng-model="dateValue"></time-date-picker>
```

### Options

* **theme** String representing one of the supported themes, default value is set via the `scDateTimeConfig.defaultTheme` property.
* **autosave** If this attribute is present the cancel and save buttons are removed and their respective events do not fire. The model is updated as the picker changes. Default value is set via the `scDateTimeConfig.autosave` property.
* **on-cancel** Function passed in is called if the cancel button is pressed. `on-cancel="cancelFn()"`
* **on-save** Function passed in is called when the date is saved via the OK button, date value is available as $value. `on-save="saveFn($value)"`
* **default-mode** A string of value 'date'/'time', which side of the slider that should be shown initially, overridden by display-mode. Default value is set via the `scDateTimeConfig.defaultMode` property.
* **default-date** A date-time string that the selects the date should the model be null. Defaults to today (new Date()). Default can be overridden globally via `scDateTimeConfig.defaultDate` property.
* **display-mode** Options are "full"; display time and date selectors and no display, "time"; show only the time input, "date"; show only the date input. Default value is set via the `scDateTimeConfig.displayMode` property.
* **orientation** If this string value is 'true' then the picker will be in vertical mode. Otherwise it will change to vertical mode if the screen width is less than 51rem as that is the size of the editor. Default value is set via the `scDateTimeConfig.defaultOrientation` property.
* **display-twentyfour** If this value is truthy then display 24 hours in time, else use 12 hour time. Default value is set via the `scDateTimeConfig.displayTwentyfour` property.
* **mindate** A date string that represents the minimum selectable date/time
* **maxdate** A date string that represents the maximum selectable date/time
* **weekdays** Optionally bind an array of strings, this defaults to the englist S, M, T, W etc. Intended for full multilanguage support on directive level.

#### scDateTimeI18n

Currently there is a value defined on the module which has all of the aria-label and text values for the entire picker. This can be overwritten for full multilanguage support as follows (all defaults shown):

```javascript
angular.module('testMod', ['scDateTime']).value('scDateTimeI18n', {
	previousMonth: "Previous Month",
	nextMonth: "Next Month",
	incrementHours: "Increment Hours",
	decrementHours: "Decrement Hours",
	incrementMinutes: "Increment Minutes",
	decrementMinutes: "Decrement Minutes",
	switchAmPm: "Switch AM/PM",
	now: "Now",
	cancel: "Cancel",
	save: "Save",
	weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	switchTo: 'Switch to',
	clock: 'Clock',
	calendar: 'Calendar'
});
```

#### scDateTimeConfig

Default values for globally configurable options as follows:

```javascript
.value('scDateTimeConfig', {
	defaultTheme: 'material',
	autosave: false,
	defaultMode: 'date',
	defaultDate: undefined, //should be date object!!
	displayMode: undefined,
	defaultOrientation: false,
	displayTwentyfour: false
})
```

### Issues?

It has been tested to work on Chrome, Safari, Opera, Firefox and Internet Explorer 8+.
If you find something, please let me know - throw me a message, or submit a issue request!

### FAQ

1. **The editor appears at a strange size?** The editor is sized using REM, so try changing the font-size, or at least the font-size at the editor base. I find the following works well:
```css
.time-date {
	font-size: 14px !important;
}
```

## Developer Notes

When checking out, you need a node.js installation, running `npm install` will get you setup with everything to run the compile and unit tests tasks (Coming Soon!).
All changes should be done in the lib folder, running `gulp compile` to compile the app or use `gulp watch` to compile the files as you save them.
Read the CONTRIBUTING.md file before starting a PR.

## License

This project is licensed under the [MIT license](http://opensource.org/licenses/MIT).


## Contributers

Special thanks to all the contributions thus far! 

For a full list see: https://github.com/simeonc/sc-date-time/graphs/contributors
