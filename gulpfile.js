// Импорт модулей Gulp
const { src, dest, watch, parallel, series } = require('gulp');

// Подключение плагинов
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');
const include = require('gulp-include');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');

// ========  ЗАДАЧИ ========= //

// 1. Обработка HTML с компонентным подходом
function pages() {
  return src('./src/pages/*.html', { allowEmpty: true })
    .pipe(include({ includePath: './src/components' }))
    .pipe(dest('src'))
    .pipe(browserSync.stream());
}

// 2. Обработка шрифтов (конвертация в woff и woff2)
function fonts() {
  return src('./src/fonts/src/*.*')
    .pipe(fonter({ formats: ['woff', 'ttf'] }))
    .pipe(src('./src/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('./src/fonts'));
}

// 3. Оптимизация изображений
function images() {
  return src(['./src/images/src/*.*', '!./src/images/src/*.svg'])
    .pipe(newer('./src/images'))
    .pipe(avif({ quality: 50 }))
    .pipe(src('./src/images/src/*.*'))
    .pipe(newer('./src/images'))
    .pipe(webp())
    .pipe(src('./src/images/src/*.*'))
    .pipe(newer('./src/images'))
    .pipe(imagemin())
    .pipe(dest('./src/images'));
}

// 4. Генерация SVG-спрайтов
function sprite() {
  return src('./src/images/icons/*.svg')
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
            example: true,
          },
        },
      })
    )
    .pipe(dest('./src/images/icons'));
}

// 5. Обработка JavaScript
const isNotMinified = (file) => !file.basename.endsWith('.min.js');
function scripts() {
  return src('src/js/src/*.js', { allowEmpty: true })
    .pipe(gulpIf(isNotMinified, uglify()))
    .pipe(gulpIf(isNotMinified, rename({ suffix: '.min' })))
    .pipe(dest('src/js'))
    .pipe(browserSync.stream());
}

// 6. Обработка SCSS → CSS
function styles() {
  return src('src/styles/main.scss', { allowEmpty: true })
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(concat('main.min.css'))
    .pipe(dest('src/styles'))
    .pipe(browserSync.stream());
}

// 7. Удаление папки dist
function cleanDist() {
  return src('dist', { read: false, allowEmpty: true }).pipe(clean());
}

// 8. Сборка проекта (копирование файлов в dist)
function building() {
  return src(
    [
      'src/styles/main.min.css',
      'src/images/*.*',
      'src/images/icons/*.*',
      '!src/images/src',
      'src/fonts/*.*',
      '!src/fonts/src',
      'src/js/*.min.js',
      '!src/js/src',
      'src/**/*.html',
    ],
    { base: 'src', allowEmpty: true }
  ).pipe(dest('dist'));
}

// 9. Запуск локального сервера и слежение за файлами
function watching() {
  browserSync.init({
    server: { baseDir: 'src/' },
  });

  watch(['src/styles/**/*.scss'], styles);
  watch(['src/images/src'], images);
  watch(['src/js/src/*.js'], scripts);
  watch(['src/components/*', 'src/pages/*'], pages);
  watch(['src/*.html']).on('change', browserSync.reload);
}

// ========  ЭКСПОРТЫ ========= //
exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.pages = pages;
exports.sprite = sprite;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building); // Сборка проекта
exports.default = parallel(styles, scripts, watching); // Основной запуск