const metalsmith = require('metalsmith'),
    assets = require('metalsmith-assets'),
    autoprefixer = require('metalsmith-autoprefixer'),
    ignore = require('metalsmith-ignore'),
    markdown = require('metalsmith-markdown'),
    metadata = require('metalsmith-metadata-directory'),
    debug = require('metalsmith-debug'),
    permalinks = require('metalsmith-permalinks'),
    sass = require('metalsmith-sass'),
    serve = require('metalsmith-serve'),
    templates = require('metalsmith-layouts'),
    typography = require('metalsmith-typography'),
    nunjucks = require('nunjucks'),
    cmdArgs = require('yargs').argv,
    _ = require('lodash'),

    // Metalsmith plugins
    metadataPatch = require('./src/plugins/metadata-patch'),

    // Nunjucks filters
    nunjucksJsonFilter = require('./src/nunjucks/json-filter'),
    nunjucksMdFilter = require('./src/nunjucks/markdown-filter'),

    // Global configuration data
    globalData = require('./contents/global.json'),
    metadataOpts = {
        site: {
            url: globalData.url,
            title: globalData.title,
            prod: cmdArgs.prod === true,
        },
        _,
    };

/* eslint-disable no-unused-vars */
let builder;
/* eslint-enable no-unused-vars */

builder =
    metalsmith(__dirname)
        .metadata(metadataOpts)
        // Read all input from contents/
        .source('./contents')
        // Write all output to output/
        .destination('./docs')
        // Workaround for metalsmith.metadata issue on watching files
        // See: https://github.com/segmentio/metalsmith-collections/issues/27#issuecomment-266647074
        .use(metadataPatch(metadataOpts))
        // Clean the output directory each time
        .clean(true)
        // Copy static assets from assets/ -> assets/
        .use(assets({
            source: './assets',
            destination: './assets',
        }))
        // Copy all .json files into global metadata for easy access
        //   resume.json -> metadata.resume = {}
        .use(metadata({
            directory: './contents/**/*.json',
        }))
        // Process markdown files
        .use(markdown())
        // Run files through typography plugin for formatting
        .use(typography({
            lang: 'en',
        }))
        // Generate permalinks
        //   contents/post/test-post -> /post/test-post/index.html
        .use(permalinks({
            relative: false,
        }))
        // Register the rendering engine
        .use(templates({
            engine: 'nunjucks',
            directory: 'templates',
            // Function add nunjucks specific functionality
            exposeConsolidate(requires) {
                _.set(requires, 'nunjucks', nunjucks.configure());
                nunjucksMdFilter.install(requires.nunjucks);
                nunjucksJsonFilter.install(requires.nunjucks);
            },
        }))
        // Compile scss files from contents/
        .use(sass({
            outputStyle: cmdArgs.prod ? 'compressed' : 'expanded',
            sourceMap: !cmdArgs.prod,
            sourceMapContents: !cmdArgs.prod,
            sourceMapEmbed: !cmdArgs.prod,
        }))
        // Autoprefix CSS
        .use(autoprefixer())
        // Don't output .json files
        .use(ignore('**/*.json'));

if (cmdArgs.serve) {
    builder = builder.use(serve({
        port: 8080,
        verbose: true,
    }));
}

if (cmdArgs.debug) {
    builder = builder.use(debug());
}

builder = builder.build((err) => {
    /* eslint-disable no-console */
    if (err) {
        console.error(err);
    } else {
        console.log('Site build complete!');
    }
    /* eslint-enable no-console */
});
