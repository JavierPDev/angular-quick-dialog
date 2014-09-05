var gulp = require('gulp'),
	uglify = require('gulp-uglifyjs'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
	karma = require('gulp-karma'),
	ngAnnotate = require('gulp-ng-annotate'),
    htmlMin = require('gulp-htmlmin'),
    html2js = require('gulp-ng-html2js'),
	protractor = require('gulp-protractor').protractor;



gulp.task('test', ['test:unit', 'test:e2e']);
gulp.task('build', ['uglify']);


gulp.task('test:unit', function() {
	return gulp.src([
			'./example/vendor/angular/angular.js',
			'./example/vendor/angular-mocks/angular-mocks.js',
			'./test/dialog.spec.js',
            './dist/angular-quick-dialog.min.js'
		])
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}));
});


gulp.task('test:e2e', function() {
	var httpServer = require('child_process')
						.fork('node_modules/http-server/bin/http-server');
	var webdriver = require('child_process')
						.spawn('webdriver-manager', ['start']);


	return gulp.src(['test/dialog.scenario.js'])
		.pipe(protractor({
			configFile: 'protractor.conf.js',
			debug: false
		}))
		.on('error', function(e) {
			throw e;
		})
		.on('end', function() {
			httpServer.kill();
			webdriver.kill();
		});
});



gulp.task('jshint', function() {
    return gulp.src('./src/angular-quick-dialog.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});




gulp.task('html2js', function() {
    return gulp.src('./template/quick-dialog.html')
        .pipe(htmlMin({collapseWhitespace: true}))
        .pipe(html2js({
            moduleName: 'angularQuickDialog',
            prefix: 'template/'
        }))
        .pipe(concat('quick-dialog.template.js'))
        .pipe(gulp.dest('./dist'));
});



gulp.task('concat', ['html2js'], function() {
	return gulp.src(['./src/angular-quick-dialog.js', './dist/quick-dialog.template.js'])
		.pipe(concat('angular-quick-dialog.js'))
		.pipe(gulp.dest('./dist'));
});



gulp.task('ngmin', ['concat'], function() {
    return gulp.src('./dist/angular-quick-dialog.js')
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./dist'));
});



gulp.task('uglify', ['ngmin'], function() {
    return gulp.src(['./dist/angular-quick-dialog.js'])
		.pipe(uglify('angular-quick-dialog.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('./dist'));
});



gulp.task('bower', function() {
	var spawn = require('child_process').spawn;

	spawn('cp', ['-f', 'LICENSE', 'README.md', '../bower-angular-quick-dialog']);
	spawn('cp', ['-f', './dist/angular-quick-dialog.min.js',  '../bower-angular-quick-dialog']);
	spawn('cp', ['-f', './dist/angular-quick-dialog.min.js.map',  '../bower-angular-quick-dialog']);
	spawn('cp', ['-f', './src/angular-quick-dialog.css',  '../bower-angular-quick-dialog']);
});


gulp.task('watch:test:unit', ['test:unit'], function() {
    return gulp.watch(['./test/dialog.spec.js'], ['test:unit'])
        .on('error', function(e) {
            console.log(e);
        });
});

gulp.task('watch:test:e2e', ['test:e2e'], function() {
    return gulp.watch(['./test/dialog.scenario.js'], ['test:e2e'])
        .on('error', function(e) {
            console.log(e);
        });
});

gulp.task('watch:build', function() {
    return gulp.watch('./src/angular-quick-dialog.js', ['build']);
});

