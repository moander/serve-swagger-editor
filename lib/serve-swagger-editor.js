'use strict';

var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var connect = require('connect');
var serveJson = require('./serve-json');
var serveStatic = require('serve-static');
var serveSpecfile = require('./serve-specfile');

var swaggerEditorRoot = path.join(__dirname, '../node_modules/swagger-editor');

var defaultOptions = {
	editorRoot: swaggerEditorRoot,
	editorDefaults: JSON.parse(fs.readFileSync(path.join(swaggerEditorRoot, 'config/defaults.json'), 'utf8')),
	specfilePath: '/tmp/swagger-editor-spec.yaml',
	specfileCreateIfMissing: true,
	specfileCreateIfMissingTemplatePath: path.join(swaggerEditorRoot, 'spec-files/minimal.yaml'),
};

module.exports = function (cfg, options) {				
	if (typeof options === 'string') {
		options = {specfilePath: options};
	}

	options = _.defaults(Object(options||null), defaultOptions);	
	cfg = _.defaults(Object(cfg||null), options.editorDefaults);
	
	var app = connect();
	
	app.use('/config/defaults.json', serveJson(cfg));
	
	app.use(cfg.backendEndpoint, serveSpecfile(cfg, options));
	
	app.use(serveStatic(options.editorRoot, {fallthrough: false}));

	return app;	
};

