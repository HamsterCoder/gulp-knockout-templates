/*
 gulp-knockout-templates
 Author: Olga Kobets (HamsterCoder)
 License: MIT (http://www.opensource.org/licenses/mit-license)
 Version 0.0.1
 */

(function () {
    var fs = require('fs');
    var glob = require('glob');
    var evs = require('event-stream');
    var gulpUtil = require('gulp-util');

    var includeMarker = '<!-- Gulp Knockout Templates -->';

    function includeTemplatesAtIndex(path, suffix, output) {
        var includeIndex = output.indexOf(includeMarker);

        if (includeIndex !== -1) {
            var changedOutput = '';
            var wildcard = path + '**/*' + suffix;

            changedOutput += output.substring(0, includeIndex);

            var templates = glob.sync(wildcard);
            if (templates) {
                templates.forEach(function (templatePath) {
                    var templateName = getTemplateName(templatePath, path, suffix);

                    gulpUtil.log('Processing template', templateName);

                    changedOutput += '<script type="text/html" id="' + templateName + '">' +
                        String(fs.readFileSync(templatePath)) +
                        '</script>';
                });
            } else {
                gulpUtil.log('No templates found at ', wildcard);
            }

            changedOutput += output.substring(includeIndex + includeMarker.length);

            return changedOutput;
        } else {
            gulpUtil.log('No include marker found.');
        }

        return output;
    }

    function getTemplateName(templatePath, path, suffix) {
        return templatePath.substring(path.length, templatePath.length - suffix.length);
    }

    function parseSetting(settings, name, defaultValue) {
        return (settings && typeof settings[name] !== 'undefined') ? settings[name] : defaultValue;
    }

    module.exports = function (settings) {
        var suffix = parseSetting(settings, 'suffix', '.tmpl.html');
        var path = parseSetting(settings, 'path', './');

        function includeTemplates(file) {
            var contents = String(file.contents);

            if (file.isStream()) {
                this.emit('error', new gulpUtil.PluginError('gulp-knockout-templates', 'Currently streams are not supported.'));
            }

            if (file.isBuffer()) {
                contents = includeTemplatesAtIndex(path, suffix, contents);
                file.contents = new Buffer(contents);
            }

            this.emit('data', file);
        }

        return evs.through(includeTemplates);
    };
})();
