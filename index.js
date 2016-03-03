/*
 gulp-knockout-templates
 Author: Olga Kobets (HamsterCoder)
 License: MIT (http://www.opensource.org/licenses/mit-license)
 Version 0.0.3
 */

(function () {
    var fs = require('fs');
    var glob = require('glob');
    var evs = require('event-stream');
    var gulpUtil = require('gulp-util');

    var includeMarker = '<!-- Gulp Knockout Templates -->';

    function includeTemplatesAtIndex(output, settings) {
        var debug = parseSetting(settings, 'debug', false);
        var removeDocs = parseSetting(settings, 'removeDocs', false);
        var suffix = parseSetting(settings, 'suffix', '.tmpl.html');
        var path = parseSetting(settings, 'path', './');

        /**
         * Templates may have descriptions in format <!-- parameters: ... -->,
         * these descriptions tend to get bulky, so it is nice to remove those when building production version.
         * Other comments are not affected by this simple cleanup.
         */
        function removeDocsFromTemplate(template) {
            var removeDocsRegex = /\<\!\-\-\s?parameters:[\s\S]*?\-\-\>/;

            return template.replace(removeDocsRegex, function (match) {
                if (debug) {
                    gulpUtil.log('Removed docs', match);
                }

                return '';
            });
        }

        var includeIndex = output.indexOf(includeMarker);

        if (includeIndex !== -1) {
            var changedOutput = '';
            var wildcard = path + '**/*' + suffix;

            changedOutput += output.substring(0, includeIndex);

            var templates = glob.sync(wildcard);

            if (templates) {
                templates.forEach(function (templatePath) {
                    var templateName = getTemplateName(templatePath, path, suffix);

                    if (debug) {
                        gulpUtil.log('Processing template', templateName);
                    }

                    var template = String(fs.readFileSync(templatePath));

                    if (removeDocs) {
                        template = removeDocsFromTemplate(template);
                    }

                    changedOutput += '<script type="text/html" id="' + templateName + '">' + template + '</script>';
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
        function includeTemplates(file) {
            var contents = String(file.contents);

            if (file.isStream()) {
                this.emit('error', new gulpUtil.PluginError('gulp-knockout-templates', 'Currently streams are not supported.'));
            }

            if (file.isBuffer()) {
                contents = includeTemplatesAtIndex(contents, settings);
                file.contents = new Buffer(contents);
            }

            this.emit('data', file);
        }

        return evs.through(includeTemplates);
    };
})();
