
```js
var app = require('serve-swagger-editor')({
	disableNewUserIntro: true,
	useBackendForStorage: true,
	useYamlBackend: true
}, '/tmp/myspec.yaml');

var server = require('http').createServer(app);

server.listen(8080, function () {
	console.log(server.address());
});
```

## Installation

```bash
$ npm install serve-swagger-editor --save
```
