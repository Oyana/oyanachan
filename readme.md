# ![Gulp-Oyana](gulp-oyana.png)
> NPM 5.5.1
> Gulp 3.9.1

## How to install

**If you havent gulp.**
* Unix: `sudo npm install gulp -g`.
* Windows: `npm install gulp -g`.

**If you havent create your `package.json` yet.**
* `npm init`

**Install**
* `npm install gulp-oyana --save-dev`.

## How to use

In your `gulpfile.js`.

	var oyana = require('gulp-oyana');
	var options = {
		"jsMinPath" : "./public/js",
		"jsPath" : "./resources/js",
		"jsName" : "main.min",
		"cssPath" : "./public/css",
		"scssPath" : "./resources/scss",
		"outputStyle" : "compressed",
		"imgMinPath" : "./public/img",
		"imgPath" : "./resources/img",
		"proxyPath" : "http://localhost"
	}
	oyana( options );

Use only the options you *need*!

## Command line:

| Command | Effect | Alias |
|--------|-------|-------|
| `gulp js-compile` | Compile all js from `jsPath`  to `jsMinPath`. | `gulp js`, `gulp jquery`, `gulp script`  |
| `gulp js-compile-silent` | Compile all js from `jsPath`  to `jsMinPath` without notification. |   |
| `gulp scss-compile` | Compile all scss from `scssPath`  to `cssPath` in `outputStyle`.| `gulp scss`, `gulp sass`, `gulp compass`, |
| `gulp scss-compile-silent` | Compile all scss from `scssPath`  to `cssPath` in `outputStyle` without notification. |   |
| `gulp img-minimize` | Minimize all Images from `imgPath` to `imgMinPath`. | `gulp img`, `gulp image`, `gulp images`, `gulp minimize` |
| `gulp img-minimize-silent` | Minimize all Images from `imgPath` to `imgMinPath` without notification. | |
| `gulp watch` | Watch all scss, js, img and compile on update. |   |
| `gulp watch-silent` | Watch all scss, js, img and compile on update without notification. |   |
| `gulp oyana` | Compile all files then watch it. | `gulp` |
| `gulp oyana-silent` | Compile all files then watch it without notification. | `gulp *` |
