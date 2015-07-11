
```js
var app = require('serve-swagger-editor')({
	disableNewUserIntro: true,
	useBackendForStorage: true
});

var server = require('http').createServer(app);

server.listen(8080, function () {
	console.log(server.address());
});
```

## Installation

```bash
$ npm install serve-swagger-editor --save
```