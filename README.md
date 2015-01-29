mdDateTime
===========

[![Build Status](https://travis-ci.org/simeonc/md-date-time.png?branch=master)](https://travis-ci.org/simeonc/md-date-time) [![Coverage Status](https://coveralls.io/repos/simeonc/md-date-time/badge.png)](https://coveralls.io/r/simeonc/md-date-time)


## Requirements

1. `AngularJS` ≥ `1.2.x`

### Optional Recommended requirements

1. [Angular-Material](https://github.com/angular/material)

### For non-Material projects.

If you are not using angular-material you need to shim the `md-button` directive as follows (Example for bootstrap, for non bootstrap remove the btn and btn-link classes and you will probably have to alter the styling)

```js
.directive('mdButton', [function(){
	return {
		replace: true,
		restricte: 'E',
		transclude: true,
		template: '<button class="btn btn-link md-button" ng-transclude></button>'
	};
}]);
```

### Where to get it

**Via Bower:**

Run `bower install md-date-time` from the command line.
Include script tags similar to the following:
```html
<link rel='stylesheet' href='/bower_components/md-date-time/dist/md-date-time.css'>
<script src='/bower_components/md-date-time/dist/md-date-time.js'></script>
```

**Via Github**

Download the code from [https://github.com/simeonc/md-date-time/releases/latest](https://github.com/simeonc/md-date-time/releases/latest), unzip the files then add script tags similar to the following:
```html
<link rel='stylesheet' href='/path/to/unzipped/files/md-date-time/dist/md-date-time.css'>
<script src='/path/to/unzipped/files/md-date-time/dist/md-date-time.js'></script>
```

### Usage

1. Include `md-date-time.js` and `md-date-time.css`, if not using angular-material see the **For non-Material projects** for the mdButton shim.
2. Add a dependency to `mdDateTime` in your app module, for example: ```angular.module('myModule', ['mdDateTime'])```.
3. Some implementation settings are required to get this useful, but for basic inline use:
```html
<time-date-picker ng-model="dateValue"></time-date-picker>
```

### Options

* **on-cancel:** Function passed in is called if the cancel button is pressed. `on-cancel="cancelFn()"`
* **on-save:** Function passed in is called when the date is saved via the OK button, date value is available as $value. `on-save="saveFn($value)"`
* **default-mode** A string of value 'date'/'time', which side of the slider that should be shown initially, overridden by display-mode
* **display-mode** Options are "full"; display time and date selectors and no display, "time"; show only the time input, "date"; show only the date input
* **orientation** If this string value is 'true' then the picker will be in vertical mode. Otherwise it will change to vertical mode if the screen width is less than 51rem as that is the size of the editor
* **display-twentyfour** If this value is truthy then display 24 hours in time, else use 12 hour time.
* **mindate** *Under Construction!*
* **maxdate** *Under Construction!*


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

For a full list see: https://github.com/simeonc/md-date-time/graphs/contributors
