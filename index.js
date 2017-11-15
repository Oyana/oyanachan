module.exports = function( options ) {
	var gulp = require('gulp');
	var sass = require('gulp-sass');
	var sourcemaps = require('gulp-sourcemaps');
	var concat = require("gulp-concat");
	var plumber = require("gulp-plumber");
	var uglify = require("gulp-uglify");
	var babel = require('gulp-babel');
	var autoprefixer = require('gulp-autoprefixer');
	var notify = require("gulp-notify");
	var imagemin = require('gulp-imagemin');
	var clean = require('gulp-dest-clean');
	var browserSync = require('browser-sync').create();

	var jsMinPath = options['jsMinPath'];
	var jsPath = options['jsPath'];
	var jsName = (options['jsName'] === undefined) ? "main.min" : options['jsName'];
	var cssPath = options['cssPath'];
	var scssPath = options['scssPath'];
	// var sources = (options['outputStyle'] === undefined) ? true : options['sources'];
	var outputStyle = (options['outputStyle'] === undefined) ? "nested" : options['outputStyle'];
	var imgMinPath = options['imgMinPath'];
	var imgPath = options['imgPath'];
	var proxyPath = options['proxyPath'];
	var colorStart = "\x1b[36m";
	var colorEnd = "\x1b[0m";

	if( jsPath === undefined || jsMinPath === undefined )
	{
		gulp.task('js-compile', function(){
			console.log( colorStart + "[WARNING]" + colorEnd + " JS path undefined. JS compilation is " + colorStart + "disabled" + colorEnd);
		});
		gulp.task( 'js-compile-silent', ['js-compile'] );
	}
	else
	{
		var jsFiles = [
			jsPath+'/*/*.js',
			jsPath+'/*.js',
			"!"+jsMinPath+'/'+jsName+'.js'
		];
		gulp.task('js-compile', function(){
			return gulp.src(jsFiles)
				.pipe(sourcemaps.init())
				.pipe(plumber())
				.pipe(concat(jsName+'.js'))
				.pipe(babel({
					presets: ['@babel/env']
				}))
				.pipe(uglify())
				.pipe(sourcemaps.write('.'))
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
			return gulp.src(jsFiles)
				.pipe(sourcemaps.init())
				.pipe(plumber())
				.pipe(concat(jsName+'.js'))
				.pipe(babel({
					presets: ['@babel/env']
				}))
				.pipe(uglify())
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(jsMinPath));
		});
	}

	if( cssPath === undefined || scssPath === undefined )
	{
		gulp.task('scss-compile', function(){
			console.log( colorStart + "[WARNING]" + colorEnd + " SCSS path undefined. SCSS compilation is " + colorStart + "disabled" + colorEnd);
		});
		gulp.task( 'scss-compile-silent', ['scss-compile'] );
	}
	else
	{
		gulp.task('scss-compile', function () {
			return gulp.src(scssPath + '/**/*.scss')
				.pipe(sourcemaps.init())
				.pipe(sass({
					outputStyle: outputStyle
				}).on('error', sass.logError))
				.pipe(autoprefixer({
					browsers: ['last 10 versions', 'ie >= 10'],
					cascade: true
				}))
				.pipe(sourcemaps.write('.'))
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
				.pipe(sourcemaps.init())
				.pipe(sass({
					outputStyle: outputStyle
				}).on('error', sass.logError))
				.pipe(autoprefixer({
					browsers: ['last 10 versions', 'ie >= 10'],
					cascade: true
				}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(cssPath));
		});
	}

	if( imgPath === undefined || imgMinPath === undefined )
	{
		gulp.task('img-minimize', function(){
			console.log( colorStart + "[WARNING]" + colorEnd + " IMG path undefined. IMG minimization is " + colorStart + "disabled" + colorEnd);
		});
		gulp.task( 'img-minimize-silent', ['img-minimize'] );
	}
	else
	{
		var imgFiles = [
			imgPath+'/*/*',
			imgPath+'/*'
		];
		gulp.task('img-minimize', function(){
			gulp.src(imgPath)
				.pipe(clean(imgMinPath));
			return gulp.src(imgFiles)
				.pipe(imagemin([imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()]))
				.pipe(gulp.dest(imgMinPath))
				.pipe(notify({
					title: "Images Minimized",
					message: "Compiled file: <%= file.relative %> \n\r <%= options.date %>!",
					templateOptions: {
						date: new Date()
					}
				}));
		});
		gulp.task('img-minimize-silent', function(){
			gulp.src(imgPath)
				.pipe(clean(imgMinPath));
			return gulp.src(imgFiles)
				.pipe(imagemin([imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()]))
				.pipe(gulp.dest(imgMinPath));
		});
	}

	if( proxyPath === undefined )
	{
		gulp.task('browser-sync', function(){
			console.log( colorStart + "[WARNING]" + colorEnd + " proxy path undefined. Browser sync is " + colorStart + "disabled" + colorEnd);
		});
	}
	else
	{
		gulp.task('browser-sync', function() {
			browserSync.init({
				proxy: proxyPath
			});
		});
	}

	gulp.task('watch', function(){
		gulp.src("")
		.pipe(notify({
				title: "Watch started",
				message: "Im watching js , images & scss modification..."
			}
		));
		if( cssPath !== undefined && scssPath !== undefined )
		{
			gulp.watch([scssPath+"/*/*.scss", scssPath+"/*.scss"], ['scss-compile', 'browser-sync']);
		}
		if( jsPath !== undefined && jsMinPath !== undefined )
		{
			gulp.watch([jsPath+"/*/*.js", jsPath+"/*.js"], ['js-compile', 'browser-sync']);
		}
		if( imgPath !== undefined && imgMinPath !== undefined )
		{
			gulp.watch([imgPath+"/*/*", imgPath+"/*/*"], ['img-minimize', 'browser-sync']);
		}
	});

	gulp.task('watch-silent', function(){
		if( cssPath != undefined && scssPath != undefined )
		{
			gulp.watch([scssPath+"/*/*.scss", scssPath+"/*.scss"], ['scss-compile-silent', 'browser-sync']);
		}
		if( jsMinPath != undefined && jsMinPath != undefined )
		{
			gulp.watch([jsPath+"/*/*.js", jsPath+"/*.js"], ['js-compile-silent', 'browser-sync']);
		}
		if( imgPath != undefined && imgMinPath != undefined )
		{
			gulp.watch([imgPath+"/*/*", imgPath+"/*"], ['img-minimize-silent', 'browser-sync']);
		}
	});

	gulp.task('hello-world', function(){
		return gulp.src("./config.php")
		.pipe(notify({
				title: "Hi!",
				message: "Wellcome on your project! \n Try to have fun! ;)"
			}
		));
	});

	gulp.task('oyana', ['hi', 'js-compile-silent', 'scss-compile-silent', 'img-minimize-silent', 'watch'], function()
	{
		console.log('I can also make coffe...\n You can stop me with \x1b[36m [CTRL + C] \x1b[0m');
	});
	gulp.task('oyana-silent', ['js-compile-silent', 'scss-compile-silent', 'img-minimize-silent', 'watch-silent'], function()
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

	gulp.task( 'img', ['img-minimize'] );
	gulp.task( 'image', ['img-minimize'] );
	gulp.task( 'images', ['img-minimize'] );
	gulp.task( 'minimize', ['img-minimize'] );
}
