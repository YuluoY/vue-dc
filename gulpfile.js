import gulp from 'gulp';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import gulpif from 'gulp-if';
import jsonEditor from 'gulp-json-editor';
import del from 'del';
import { spawn } from 'child_process';


// 环境变量
const isProduction = process.env.NODE_ENV === 'production';

// 清理构建目录
function clean() {
  return del(['dist', 'build']);
}

// 使用 Rollup 构建所有 JavaScript 文件
async function scripts() {
  return new Promise((resolve, reject) => {
    const rollup = spawn('npx', ['rollup', '-c'], { 
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: isProduction ? 'production' : 'development' }
    });
    
    rollup.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Rollup build failed with code ${code}`));
      }
    });
    
    rollup.on('error', reject);
  });
}

// 处理 CSS 文件（如果有的话）
function styles() {
  return gulp
    .src('src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('vue-dc.css'))
    .pipe(autoprefixer())
    .pipe(gulpif(isProduction, cleanCSS()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}

// 复制其他文件
function copy() {
  return gulp
    .src([
      'src/**/*.json',
      'src/**/*.md'
    ])
    .pipe(gulp.dest('dist'));
}

// Rollup 会处理所有模块格式，这些函数不再需要

// 更新 package.json 的 exports 字段
function updatePackageJson() {
  return gulp
    .src('package.json')
    .pipe(jsonEditor(function(json) {
      json.exports = {
        ".": {
          "import": "./dist/vue-dc.esm.js",
          "require": "./dist/vue-dc.umd.js"
        }
      };
      json.main = "./dist/vue-dc.umd.js";
      json.module = "./dist/vue-dc.esm.js";
      json.unpkg = "./dist/vue-dc.min.js";
      json.jsdelivr = "./dist/vue-dc.min.js";
      return json;
    }))
    .pipe(gulp.dest('.'));
}

// 监听文件变化
function watch() {
  gulp.watch(['src/**/*.js', 'index.js'], scripts);
  gulp.watch('src/**/*.css', styles);
  gulp.watch('src/**/*.json', copy);
}

// 构建任务
const build = gulp.series(
  clean,
  gulp.parallel(scripts, styles, copy),
  updatePackageJson
);

// 开发任务
const dev = gulp.series(
  clean,
  gulp.parallel(scripts, styles, copy),
  watch
);

// 导出任务
export { clean, scripts, styles, copy, watch, build, dev };

export default build;
