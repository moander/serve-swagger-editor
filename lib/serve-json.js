'use strict';

module.exports = function (obj) {
	var objBody = JSON.stringify(Object(obj||null));
	var objHead = {
		'Content-Type': 'application/json',
		'Content-Length': String(objBody.length)	
	};
	
	return function serveJson(req, res, next) {
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			res.writeHead(405, {
				'Allow': 'GET, HEAD',
				'Content-Length': '0'
			});
			res.end();
			return;
		}
		
		res.writeHead(200, objHead);

		if (req.method === 'HEAD') {
			res.end();
		} else {
			res.end(objBody);				
		}
	};
};