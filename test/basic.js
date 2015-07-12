'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var http = require('http');
var path = require('path');
var request = require('supertest');
var connect = require('connect');
var serveEditor = require('..');


describe('serveSwaggerEditor() basic tests', function() {
	describe('http server', function() {
		var server;
	    before(function () {
	    	server = http.createServer(serveEditor());		  
	    });
		
		it('should return index.html', function (done) {
			readFile('../node_modules/swagger-editor/index.html', done, function (data) {
				request(server)
				.get('/')
				.expect(200, data, done);				
			});
		});

		it('should return main.html', function (done) {
			readFile('../node_modules/swagger-editor/views/main.html', done, function (data) {
				request(server)
				.get('/views/main.html')
				.expect(200, data, done);				
			});
		});

		it('should return 500 error', function (done) {
			request(server)
			.get('/editor/spec')
			.expect(500, done);							
		});

		it('should return json config', function (done) {
			request(server)
			.get('/config/defaults.json')
			.expect('Content-Type', 'application/json')
			.expect(200, done);							
		});
	});
	
	describe('connect middleware', function() {
		var server;
	    before(function () {
			var app = connect();
			app.use(serveEditor());
	    	server = http.createServer(app);		  
	    });
		
		it('should return index.html', function (done) {
			readFile('../node_modules/swagger-editor/index.html', done, function (data) {
				request(server)
				.get('/')
				.expect(200, data, done);				
			});
		});

		it('should return main.html', function (done) {
			readFile('../node_modules/swagger-editor/views/main.html', done, function (data) {
				request(server)
				.get('/views/main.html')
				.expect(200, data, done);				
			});
		});

		it('should return 500 error', function (done) {
			request(server)
			.get('/editor/spec')
			.expect(500, done);							
		});

		it('should return json config', function (done) {
			request(server)
			.get('/config/defaults.json')
			.expect('Content-Type', 'application/json')
			.expect(200, done);							
		});
	});
	
	
	describe('connect middleware custom root', function() {
		var server;
	    before(function () {
			var app = connect();
			app.use('/custom/root', serveEditor());
	    	server = http.createServer(app);		  
	    });
		
		it('should return index.html', function (done) {
			readFile('../node_modules/swagger-editor/index.html', done, function (data) {
				request(server)
				.get('/custom/root/')
				.expect(200, data, done);				
			});
		});

		it('should return main.html', function (done) {
			readFile('../node_modules/swagger-editor/views/main.html', done, function (data) {
				request(server)
				.get('/custom/root/views/main.html')
				.expect(200, data, done);				
			});
		});

		it('should return json config', function (done) {
			request(server)
			.get('/custom/root/config/defaults.json')
			.expect('Content-Type', 'application/json')
			.expect(200, done);							
		});
		
		it('should return 500 error', function (done) {
			request(server)
			.get('/custom/root/editor/spec')
			.expect(500, done);							
		});
		
		it('should return 404 error', function (done) {
			request(server)
			.get('/editor/spec')
			.expect(404, done);							
		});

		it('should return 303 redirect', function (done) {
			request(server)
			.get('/custom/root')
			.expect(303, done);							
		});
	});
});

function readFile(relativePath, done, callback) {
	fs.readFile(path.join(__dirname, relativePath), 'utf8', function (err, data) {
		if (err) done(err);
		else callback(data);
	});
}