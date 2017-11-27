var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var config = require('./config');

app.use(express.static(path.join(config.PATH)));

// can be viewed at http://localhost:config.PORT
app.get('/', function (req, res) {
  res.sendFile(path.join(config.PATH, 'index.html'));
});

if (config.USE_EXPRESS) {
  http.createServer(app).listen(config.PORT, function () {
    console.log('Express server listening on port ' + config.PORT);
  });
}
