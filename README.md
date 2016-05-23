# gulp-knockout-templates
Include external knockout templates when building project with gulp. Convenient addition to using knockout-amd-helpers.

## Disclaimer
Please use at your own risk. Pull requests and issues are welcome.

## Usage
Include all templates in a given directory and it's subdirectories in place of a special marker in your html file.
Glob module is used internally to get template file names.

```javascript
// gulpfile.js

var gulp = require('gulp');
var includeKnockoutTemplates = require('gulp-knockout-templates');

gulp.task('page', function () {
    return gulp.src('./app/index.html')
        .pipe(includeKnockoutTemplates({
            path: './app/templates/',
            suffix: '.tmpl.html'
        }))
        .pipe(gulp.dest('./dist'));
});

```

```html
<!-- ./app/templates/greetings.tmpl.html -->

<div data-bind="text: greetings"></div>
```

```html
<!-- ./app/index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <!-- Gulp Knockout Templates -->
</head>
<body>
    <div data-bind="template: { name: 'greetings' }"></div>
</body>
</html>
```

```html
<!-- ./dist/index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script type="text/html" id="greetings"><!-- ./app/templates/greetings.tmpl.html -->
                                            
    <div data-bind="text: greetings"></div></script>
</head>
<body>
    <div data-bind="template: { name: 'greetings' }"></div>
</body>
</html>
```

## Removing inline documentation

If you have inline documentation for your templates specified in format ```<!-- parameters: ... -->``` you can remove it using ```removeDocs``` option.

## [ADVANCED] Determining knockout template id

Most likely you have a setting for your knockout template engine of this sort (the following example is default setting of knockout-amd-helpers):

```javascript
engine.defaultPath = "templates";
engine.defaultSuffix = ".tmpl.html";
```

It means that knockout-amd-helpers amdTemplateEngine will load templates from a location that is computed in the following way:

```javascript
addTrailingSlash(engine.defaultPath) + this.key + engine.defaultSuffix
```

It also means that when template is already included inline it will look for template with a given key by default before loading it with amd.

The way this plugin computes template id is the following - take path produced by glob from you path and suffix settings, then strip path and suffix to produce id.

But say for some reason you only want to include template from a subdirectory. You configure the plugin as follows:

```javascript
// gulpfile.js

var gulp = require('gulp');
var includeKnockoutTemplates = require('gulp-knockout-templates');

gulp.task('page', function () {
    return gulp.src('./app/index.html')
        .pipe(includeKnockoutTemplates({
            path: './app/templates/special/',
            suffix: '.tmpl.html'
        }))
        .pipe(gulp.dest('./dist'));
});

```

While not changing default template path. So you still reference your template as follows:

```html
<div data-bind="template: { name: 'special/greetings' }"></div>
```

In this case the plugin will calculate the template as ```greetings``` which is not what you really want. Trying to load/reference this template will result in error.

This is where ```defaultPath``` setting comes in to save the day as it will be used instead of ```path``` setting to compute template id as described above.

So adding ```defaultPath: './app/templates/'``` will help produce correct id of ```special/greetings```. ```defaultPath``` must be a subpath of ```path```.

### Parameters

*  ```path {String}``` - path to your templates, defaults to ```./```
*  ```defaultPath {String}``` - default path to your templates used by amd template engine, defaults to value of ```path```
*  ```suffix {String}``` - your template files extention, defaults to ```.tmpl.html```
*  ```removeDocs {Boolean}``` - remove inline documentation, that matches ```<!-- parameters: ... -->``` format, defaults to ```false```
*  ```debug {Boolean}``` - show verbose build information, e.g what templates were processed and what docs were removed, defaults to ```false```





