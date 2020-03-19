module.exports = function( options ) {
	const { src, dest, parallel } = require('gulp');
	const gulp = require('gulp');
	const sass = require('gulp-sass');
	const sourcemaps = require('gulp-sourcemaps');
	const concat = require("gulp-concat");
	const plumber = require("gulp-plumber");
	const uglify = require("gulp-uglify");
	const autoprefixer = require('gulp-autoprefixer');
	const notify = require("gulp-notify");
	const imagemin = require('gulp-imagemin');
	const clean = require('gulp-dest-clean');
	const browserSync = require('browser-sync').create();
	const babel = require('gulp-babel');
	const htmlmin = require('gulp-htmlmin');
	const jsName = (options['jsName'] === undefined) ? 'main.min' : options['jsName'];
	const sources = (options['outputStyle'] === undefined) ? true : options['sources'];
	const outputStyle = (options['outputStyle'] === undefined) ? 'nested' : options['outputStyle'];
	const imgPath = options['imgPath'];
	const colorStart = '\x1b[36m';
	const colorEnd = '\x1b[0m';
	const defaultPath = './gulpfile.js'; // default path is used to trigger a radom gulp call back to use notify easyer

	/**
	 * @author Golga <r-ro@bulko.net>
	 * @since 0.8.0 ( 2020-03-19 )
	 *
	 * @return GulpCB
	 */
	let defaultCB = () => {
		return gulp.src( defaultPath );
	}
	/**
	 * @author Golga <r-ro@bulko.net>
	 * @since 0.8.0 ( 2020-03-19 )
	 *
	 * @param GulpCB tcb
	 * @param String notifyTitle
	 * @param String notifyBody
	 * @return Void
	 */
	let notifyBuilder = ( tcb, notifyTitle, notifyBody ) => {
		tcb.pipe(
			notify({
				title: notifyTitle,
				message: notifyBody,
				templateOptions: {
					date: new Date()
				}
			})
		);
	}
	/**
	 * @author Golga <r-ro@bulko.net>
	 * @since 0.8.0 ( 2020-03-19 )
	 *
	 * @param String taskName
	 * @param Function task
	 * @param Bool || Function taskDisabled
	 * @param String notifyTitle
	 * @param String notifyBody
	 * @return Void
	 */
	let taskBuilder = ( taskName, task, taskDisabled, notifyTitle, notifyBody ) => {
		if( taskDisabled )
		{
			gulp.task( taskName, cb => {
				console.log(
					colorStart
					+ '[WARNING]'
					+ colorEnd
					+ ' Due to curent configuration '
					+ taskName
					+ ' is curently '
					+ colorStart
					+ 'disabled'
					+ colorEnd
				);
				cb();
			});
			gulp.task( taskName + '-silent', gulp.parallel( [ taskName ] ) );
		}
		else
		{
			if ( notifyTitle !== undefined && notifyBody !== undefined )
			{
				gulp.task( taskName + '-silent', cb => {
					task();
					cb();
				});
				gulp.task( taskName, cb => {
					const tcb = task()
					tcb.pipe( notify( {
						title: notifyTitle,
						message: notifyBody,
						templateOptions: {
							date: new Date()
						}
					}));
					cb();
				});
			}
			else
			{
				gulp.task( taskName, cb => {
					task();
					cb();
				});
			}
		}
	}
	/**
	 * @author Golga <r-ro@bulko.net>
	 * @since 0.8.0 ( 2020-03-19 )
	 *
	 * @param String taskName
	 * @param Array taskList
	 * @return Void
	 */
	let aliasBuilder = ( taskName, taskList ) => {
		gulp.task(
			taskName,
			gulp.parallel([ taskList ]), cb => {
				cb();
			}
		);
	}

	taskBuilder(
		'js-compile',
		() => {
			const jsFiles = [
				options['jsPath'] + '/*/*.js',
				options['jsPath'] + '/*.js',
				'!' + options['jsMinPath'] + '/' + jsName + '.js'
			];
			return gulp.src(jsFiles)
				.pipe(babel({
					presets: ['@babel/env']
				}))
				.pipe( sourcemaps.init() )
				.pipe( plumber() )
				.pipe( concat( jsName + '.js' ) )
				.pipe( uglify() )
				.pipe( sourcemaps.write( '.' ) )
				.pipe( gulp.dest( options['jsMinPath'] ) ) ;
		},
		( options['jsPath'] === undefined || options['jsMinPath'] === undefined ),
		'JS Compiled',
		'Compiled file: <%= file.relative %> \n\r <%= options.date %>!'
	);

	taskBuilder(
		'scss-compile',
		() => {
			return gulp.src( options['scssPath'] + '/**/*.scss' )
				.pipe( sourcemaps.init() )
				.pipe(
					sass({
						outputStyle: outputStyle
					})
					.on( 'error', sass.logError )
				)
				.pipe(
					autoprefixer({
						cascade: true
					})
				)
				.pipe( sourcemaps.write( '.' ) )
				.pipe( gulp.dest( options['cssPath'] ) );
		},
		( options['cssPath'] === undefined || options['scssPath'] === undefined ),
		'SCSS Compiled',
		'Compiled file: <%= file.relative %> \n\r <%= options.date %>!'
	);

	taskBuilder(
		'html-compile',
		() => {
			for ( let key in options['htmlPages'] )
			{
				let pages = [];
				for ( let key2 in options['htmlPages'][key] )
				{
					pages[key2] = options['htmlPath'] + '/' + options['htmlPages'][key][key2];
				}
				gulp.src( pages )
					.pipe( plumber() )
					.pipe( concat( key ) )
					.pipe(
						htmlmin({
							collapseWhitespace: true
						})
					)
					.pipe( gulp.dest( options['htmlMinPath'] ) );
			}
			return defaultCB();
		},
		( options['htmlPages'] === undefined || options['htmlMinPath'] === undefined || options['htmlPath'] === undefined ),
		'Html compiled',
		'Compiled file: <%= file.relative %> \n\r <%= options.date %>!'
	);

	taskBuilder(
		'img-minimize',
		() => {
			const imgFiles = [
				imgPath + '/*/*',
				imgPath + '/*'
			];
			gulp.src( imgPath )
				.pipe( clean( options['imgMinPath'] ) );
			return gulp.src( imgFiles )
				.pipe( imagemin( [
					imagemin.gifsicle({
						interlaced: true,
						optimizationLevel: 3
					}),
					imagemin.mozjpeg({
						quality: 75,
						progressive: true
					}),
					imagemin.optipng({
						optimizationLevel: 5,
						interlaced: true
					}),
					imagemin.svgo({
						plugins: [
							{removeViewBox: true},
							{cleanupIDs: false}
						]
					})
				]))
				.pipe( gulp.dest( options['imgMinPath'] ) );
		},
		( imgPath === undefined || options['imgMinPath'] === undefined ),
		'Images Minimized',
		'Optimized file: <%= file.relative %> \n\r <%= options.date %>!'
	);

	taskBuilder(
		'browser-sync',
		() => {
			return browserSync.init({
				proxy: options['imgPath']
			});
		},
		( options['proxyPath'] === undefined )
	);

	taskBuilder(
		'watch',
		() => {
			if( options['cssPath'] !== undefined && options['scssPath'] !== undefined )
			{
				gulp.watch(
					[
						options['scssPath'] + '/*/*.scss',
						options['scssPath'] + '/*.scss'
					],
					gulp.series([
						'scss-compile',
						'browser-sync'
					])
				);
			}
			if( options['jsPath'] !== undefined && options['jsMinPath'] !== undefined )
			{
				gulp.watch(
					[
						options['jsPath'] + '/*/*.js',
						options['jsPath'] + '/*.js'
					],
					gulp.series([
						'js-compile',
						'browser-sync'
					])
				);
			}
			if( options['htmlPages'] !== undefined || options['htmlMinPath'] !== undefined || options['htmlPath'] !== undefined )
			{
				gulp.watch(
					[
						options['htmlPath'] + '/*/*.html',
						options['htmlPath'] + '/*.html',
						options['htmlPath'] + '/*/*.htm',
						options['htmlPath'] + '/*.htm',
						options['htmlPath'] + '/*/*.txt',
						options['htmlPath'] + '/*.txt',
						options['htmlPath'] + '/*/*.svg',
						options['htmlPath'] + '/*.svg'
					],
					gulp.series([
						'html-compile',
						'browser-sync'
					])
				);
			}
			if( imgPath !== undefined && options['imgMinPath'] !== undefined )
			{
				gulp.watch(
					[
						imgPath + '/*/*',
						imgPath + '/*'
					],
					gulp.series([
						'img-minimize',
						'browser-sync'
					])
				);
			}
			return defaultCB();
		},
		false,
		'Watch started',
		'Im watching for any assets modification.'
	);

	taskBuilder(
		'hello-world',
		() => {
			return defaultCB();
		},
		false,
		'Hi!',
		'Wellcome on your project! \n\r Try to have fun! ;)'
	);

	taskBuilder(
		'cofee',
		() => {
			return defaultCB();
		},
		false,
		'I can also make coffe...',
		'You can stop me using ' + colorStart + '[CTRL + C]' + colorEnd
	);

	/*Alias zone*/
	aliasBuilder(
		'oyana',
		[
			'js-compile-silent',
			'scss-compile-silent',
			'img-minimize-silent',
			'watch-silent',
			'cofee'
		]
	);

	aliasBuilder(
		'oyana-silent',
		[
			'js-compile-silent',
			'scss-compile-silent',
			'img-minimize-silent',
			'watch-silent'
		]
	);

	aliasBuilder( 'default', ['oyana'] );
	aliasBuilder( 'oyanachan', ['oyana'] );
	aliasBuilder( '*', ['oyana-silent'] );

	aliasBuilder( 'hello', ['hello-world'] );
	aliasBuilder( 'hi', ['hello-world'] );

	aliasBuilder( 'scss', ['scss-compile'] );
	aliasBuilder( 'sass', ['scss-compile'] );
	aliasBuilder( 'compass', ['scss-compile'] );

	aliasBuilder( 'js', ['js-compile'] );
	aliasBuilder( 'jquery', ['js-compile'] );
	aliasBuilder( 'script', ['js-compile'] );

	aliasBuilder( 'img', ['img-minimize'] );
	aliasBuilder( 'image', ['img-minimize'] );
	aliasBuilder( 'images', ['img-minimize'] );
	aliasBuilder( 'minimize', ['img-minimize'] );
}
