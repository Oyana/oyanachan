module.exports = function( options ) {

	var gulp = require('gulp');
	var sass = require('gulp-sass');
	var concat = require("gulp-concat");
	var plumber = require("gulp-plumber");
	var uglify = require("gulp-uglify");
	var autoprefixer = require('gulp-autoprefixer');
	var notify = require("gulp-notify");

	var jsMinPath = options['jsMinPath'];
	var jsPath = options['jsPath'];
	var cssPath = options['cssPath'];
	var scssPath = options['scssPath'];
	var outputStyle = options['outputStyle'];
	var colorStart = "\x1b[36m";
	var colorEnd = "\x1b[0m";

	if( outputStyle == undefined )
	{
		outputStyle = "nested";
	}

	if( jsMinPath == undefined || jsMinPath == undefined )
	{
		gulp.task('js-compile', function(){
			console.log( colorStart + "[WARNING]" + colorEnd + " JS path undefined. JS compilation is " + colorStart + "disabled" + colorEnd);
		});
		gulp.task( 'js-compile-silent', ['js-compile'] );
	}
	else
	{
		gulp.task('js-compile', function(){
			var files = [
				jsPath+'/*.js',
				"!"+jsMinPath+'/main.min.js'
			];
			return gulp.src(files)
				.pipe(plumber())
				.pipe(uglify())
				.pipe(gulp.dest(jsMinPath))
				.pipe(notify({
					title: "JS Compiled",
					message: "Compiled file: <%= file.relative %> \n\r <%= options.date %>!",
					templateOptions: {
						date: new Date()
					}
				}));
		});
		gulp.task('js-compile-silent', function(){
			var files = [
				jsPath+'/*.js'
			];
			return gulp.src(files)
				.pipe(plumber())
				.pipe(concat('main.min.js'))
				.pipe(uglify())
				.pipe(gulp.dest(jsMinPath));
		});
	}

	if( cssPath == undefined || scssPath == undefined )
	{
		gulp.task('scss-compile', function(){
			console.log( colorStart + "[WARNING]" + colorEnd + " SCSS path undefined. SCSS compilation is " + colorStart + "disabled" + colorEnd);
		});
		gulp.task( 'scss-compile-silent', ['scss-compile'] );
	}
	else
	{
		gulp.task('scss-compile', function () {
			console.log(scssPath);

			return gulp.src(scssPath + '/**/*.scss')
				.pipe(sass({
					outputStyle: outputStyle
				}).on('error', sass.logError))
				.pipe(autoprefixer({
					browsers: ['last 10 versions', 'ie >= 10'],
					cascade: true
				}))
				.pipe(gulp.dest(cssPath))
				.pipe(notify({
					title: "SCSS Compiled",
					message: "Compiled file: <%= file.relative %> \n\r <%= options.date %>!",
					templateOptions: {
						date: new Date()
					}
				}));
		});
		gulp.task('scss-compile-silent', function () {
			return gulp.src(scssPath + '/**/*.scss')
				.pipe(sass({
					outputStyle: outputStyle
				}).on('error', sass.logError))
				.pipe(autoprefixer({
					browsers: ['last 10 versions', 'ie >= 10'],
					cascade: true
				}))
				.pipe(gulp.dest(cssPath));
		});
	}

	gulp.task('watch', function(){
		gulp.src("")
		.pipe(notify({
				title: "Watch started",
				message: "Im watching js & scss modification..."
			}
		));
		if( cssPath != undefined && scssPath != undefined )
		{
			gulp.watch(scssPath+"/**/*.scss", ['scss-compile']);
		}
		if( jsMinPath != undefined && jsMinPath != undefined )
		{
			gulp.watch(jsPath+"/**/*.js", ['js-compile']);
		}
	});
	gulp.task('watch-silent', function(){
		if( cssPath != undefined && scssPath != undefined )
		{
			gulp.watch(scssPath+"/**/*.scss", ['scss-compile-silent']);
		}
		if( jsMinPath != undefined && jsMinPath != undefined )
		{
			gulp.watch(jsPath+"/**/*.js", ['js-compile-silent']);
		}
	});

	gulp.task('hello-world', function(){
		return gulp.src("./config.php")
		.pipe(notify({
				title: "Hi!",
				message: "Wellcom on your project! \n Try to have fun! ;)"
			}
		));
	});

	gulp.task('oyana', ['hi', 'js-compile-silent', 'scss-compile-silent', 'watch'], function()
	{
		console.log('I can also make coffe...\n You can stop me with \x1b[36m [CTRL + C] \x1b[0m');
	});
	gulp.task('oyana-silent', ['js-compile-silent', 'scss-compile-silent', 'watch-silent'], function()
	{
		console.log('I can also make black coffe...\n You can stop me with \x1b[36m [CTRL + C] \x1b[0m');
	});

	/*Alias zone*/
	gulp.task('default', ['oyana']);
	gulp.task( '*', ['oyana-silent'] );

	gulp.task( 'hello', ['hello-world'] );
	gulp.task( 'hi', ['hello-world'] );

	gulp.task( 'scss', ['scss-compile'] );
	gulp.task( 'sass', ['scss-compile'] );
	gulp.task( 'compass', ['scss-compile'] );

	gulp.task( 'js', ['js-compile'] );
	gulp.task( 'jquery', ['js-compile'] );
	gulp.task( 'script', ['js-compile'] );
}

