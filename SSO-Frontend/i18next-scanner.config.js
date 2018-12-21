var fs = require('fs');
var chalk = require('chalk');
 
module.exports = {
    options: {
        debug: true,
        func: {
            list: ['i18next.t', 'i18n.t'],
            extensions: ['.js', '.jsx']
        },
        trans: {
            component: 'Trans',
            i18nKey: 'i18nKey',
            defaultsKey: 'defaults',
            extensions: ['.js', '.jsx'],
            fallbackKey: true
        },
        lngs:  [
            'en-US',
            'zh-TW',
            'zh-CN',
            'ja',
            'it',
            'de',
            'fr',
            'th',
            'pl',
            'es',
            'pt-BR',
            'pt-PT',
            'ru',
            'hu',
            'ar',
            'ko',
        ],
        ns: [
            'translation'
        ],
        defaultLng: 'en-US',
        defaultNs: 'translation',
        defaultValue: '__STRING_NOT_TRANSLATED__',
        resource: {
            loadPath: 'locales/{{lng}}/{{ns}}.json',
            savePath: 'locales/{{lng}}/{{ns}}.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        nsSeparator: false, // namespace separator
        keySeparator: false, // key separator
        interpolation: {
            prefix: '{{',
            suffix: '}}'
        }
    },
    transform: function customTransform(file, enc, done) {
        "use strict";
        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);
        let count = 0;
 
        parser.parseFuncFromString(content, { list: ['i18next._', 'i18next.__', 't'] }, (key, options) => {
            options.defaultValue = key;
            parser.set(key, Object.assign({}, options, {
                nsSeparator: false,
                keySeparator: false
            }));
            ++count;
        });
 
        if (count > 0) {
            console.log(`i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(JSON.stringify(file.relative))}`);
        }
 
        done();
    }
};