var fs = require('fs');
var path = require('path');
var serveStatic = require('serve-static');

var minimalTemplate = '{"swagger":"2.0","info":{"version":"0.0.0","title":"Simple API"},"paths":{"/":{"get":{"responses":{"200":{"description":"OK"}}}}}}';

module.exports = function serveSpecfile(cfg, options) {
	if (!cfg.useBackendForStorage) {
		return function serveSpecfile_disabled(req, res) {
			var emsg = 'useBackendForStorage not enabled';
			res.writeHead(500, emsg, {'Content-Length': emsg.length});
			res.end(emsg);	
		};
	}
	
	var specfile = prepfile(cfg, options);	
	var serveFile = serveStatic(specfile);

	return function serveSpecfile_mw(req, res, next) {
		if (req.method === 'GET' || req.method === 'HEAD') {
			// Serve the file
			return serveFile(req, res, next);
		} else if (req.method === 'PUT') {
			// Write file to disk
			var stream = fs.createWriteStream(specfile);
            stream.on('finish', function () {
                res.end('ok');
            });
            req.pipe(stream);			
		} else {
			// Method not allowed
			res.writeHead(405, {
				'Allow': 'GET, HEAD, PUT',
				'Content-Length': '0'
			});
			res.end();
		}
	};
};


function prepfile(cfg, options) {
	if (!options.specfilePath) {
		throw 'options.specfilePath is required';
	}
	
	var specfile = path.resolve(options.specfilePath);
	
	if (!fs.existsSync(specfile)) {
		if (options.specfileCreateIfMissing) {
			console.log('Creating specfile: ' + specfile);
			fs.writeFileSync(specfile, fs.readFileSync(options.specfileCreateIfMissingTemplatePath));
		} else {
			throw 'specfile not found: ' + specfile;
		}
	}
	
	if (!fs.statSync(specfile).isFile()) {
		throw 'specfilePath is not a file: ' + specfile;
	}
	
	return specfile;
}
