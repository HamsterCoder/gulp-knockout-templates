# gulp-knockout-templates
Include external knockout templates when building project with gulp

## Disclaimer
Project is still at it's very early stage. Use at your own risk. Pull requests and issues are welcome.

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

### Parameters

*  path {String} - path to your templates, defaults to ```./```
*  suffix {String} - your templates extention, defualts to ```.tmpl.html```





