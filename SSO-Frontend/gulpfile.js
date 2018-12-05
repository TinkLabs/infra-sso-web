const fs = require('fs');
const gulp = require('gulp');
const sort = require('gulp-sort');
const sortJSON = require('gulp-json-sort').default;
const scanner = require('i18next-scanner');
const jsonTransform = require('gulp-json-transform');
const onesky = require('gulp-onesky');
const sequence = require('run-sequence');
const post = require('gulp-onesky-post');
const i18nextConfig = require('./i18n.config');


// Generate json file for translation
gulp.task('t', () => gulp.src([
        'emails/**/*.{js,html}',
        'routes/**/*.{js,html}',
        'pages/**/*.{js,html}',
    ])
        .pipe(sort()) // Sort files in stream by path
        .pipe(scanner(Object.assign({}, i18nextConfig, {
            debug: true,
            removeUnusedKeys: true,
            sort: true,
            attr: false,
            func: {
                list: ['i18next.t', 'i18n.t', 't'],
                extensions: ['.js'],
            },
            defaultValue: function (lng, ns, key) {
                return key;
            },
            resource: {
                loadPath: '{{lng}}/{{ns}}.json',
                savePath: '{{lng}}/{{ns}}.json',
            },
            interpolation: {
                prefix: '{{',
                suffix: '}}',
            },
        })))
        .pipe(sortJSON({space: '\t'}))
        .pipe(gulp.dest('locales'))
        .on('end', () => {
            console.log('locales/en-US.json generated.');
        }),
);


gulp.task('onesky', (done) => {
    sequence('i18n:multilangual-json', 'translation-json-indent', 't', done);
});


gulp.task('i18n:multilangual-json', (done) => {
    onesky({
        publicKey: 'gblczmRUXYgWA5K4nQY9qW01WgL4MXES',
        secretKey: 'BLZL5xbPuKgw9LYXDsg4VK71K9pTiFlJ',
        projectId: '319284',
        sourceFile: 'translation.json',
    })
        .pipe(jsonTransform((data) => {
            Object.keys(data).forEach((locale) => {
                if (['en', 'en-US'].indexOf(locale) > -1) return;
                const {translation} = data[locale];
                const fileName = `locales/${locale}/translation.json`;
                fs.writeFileSync(fileName, JSON.stringify(translation));
                console.log('saved file: ', fileName);
            });
            done();
        }));
});


gulp.task('translation-json-indent', () => (
    gulp.src('locales/**/*.json')
        .pipe(sortJSON({space: 4}))
        .pipe(gulp.dest('locales'))
));


gulp.task('onesky-post', () => (
    gulp.src('locales/en/translation.json')
        .pipe(post({
            locale: 'en-US',
            publicKey: 'gblczmRUXYgWA5K4nQY9qW01WgL4MXES',
            secretKey: 'BLZL5xbPuKgw9LYXDsg4VK71K9pTiFlJ',
            projectId: '319284',
            fileName: 'translation.json',
            format: 'HIERARCHICAL_JSON',
            allowSameAsOriginal: true,
            keepStrings: false,
        }))
        .pipe(gulp.dest('locales'))
));
